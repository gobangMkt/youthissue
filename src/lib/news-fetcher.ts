import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';

export interface RawArticle {
  title: string;
  url: string;
  source: string;
  pubDate: string;
  content?: string;
}

const YOUTH_KEYWORDS = [
  '청년주택',
  '청년혜택',
  '청년현실',
  '신생아특례',
  '전월세',
  '대출',
  '취업',
  '교육',
  '복지',
  '1인 가구',
  '신혼부부',
  '특례금리',
  '구직급여',
  '학자금',
  '청년 정책',
  '청년 지원',
  '주택 지원',
  '월세 지원',
];

async function containsYouthKeyword(text: string): Promise<boolean> {
  return YOUTH_KEYWORDS.some((keyword) => text.includes(keyword));
}

async function fetchGoogleNewsRSS(days: number = 7): Promise<RawArticle[]> {
  try {
    const parser = new Parser();
    const queries = [
      '청년 정책',
      '청년 혜택',
      '청년 주택',
      '신생아 특례',
      '청년 대출',
    ];

    const allArticles: RawArticle[] = [];
    const seen = new Set<string>();

    for (const query of queries) {
      try {
        // Google News RSS Feed
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
          query
        )}&hl=ko&gl=KR&ceid=KR:ko`;

        const feed = await parser.parseURL(feedUrl);

        const now = new Date();
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        for (const item of feed.items) {
          if (!item.title || !item.link) continue;

          const pubDate = item.pubDate ? new Date(item.pubDate) : now;
          if (pubDate < cutoffDate) continue;

          // 중복 제거
          if (seen.has(item.link)) continue;
          seen.add(item.link);

          // 키워드 필터링
          const hasKeyword = await containsYouthKeyword(
            `${item.title} ${item.content || ''}`
          );
          if (!hasKeyword) continue;

          allArticles.push({
            title: item.title.replace(/ - .+$/, '').trim(),
            url: item.link,
            source: extractSource(item.title),
            pubDate: pubDate.toISOString().substring(0, 10),
            content: item.content?.substring(0, 500),
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch RSS for query "${query}":`, err);
      }
    }

    return allArticles.slice(0, 15);
  } catch (error) {
    console.error('Error fetching Google News RSS:', error);
    return [];
  }
}

function extractSource(title: string): string {
  // "제목 - 언론사" 형식에서 언론사 추출
  const match = title.match(/- (.+?)$/);
  if (match) {
    return match[1].trim();
  }
  return '기타';
}

async function enrichArticleContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 5000,
    });

    const $ = cheerio.load(response.data);

    // 기사 본문 추출 (언론사별로 다르지만 공통적인 방법)
    const body =
      $('article').text() ||
      $('div.article').text() ||
      $('div.articleView').text() ||
      $('div.article_body').text() ||
      $('div.contents').text() ||
      $.text();

    return body.substring(0, 1000);
  } catch (error) {
    console.warn(`Failed to enrich content from ${url}:`, error);
    return '';
  }
}

export async function fetchYouthPolicyNews(days: number = 7): Promise<RawArticle[]> {
  console.log(`[News Fetcher] Fetching youth policy news from last ${days} days...`);

  const articles = await fetchGoogleNewsRSS(days);
  console.log(`[News Fetcher] Found ${articles.length} articles after filtering`);

  // 각 기사에 내용 추가 (선택사항 - 시간 걸릴 수 있음)
  // const enriched = await Promise.all(
  //   articles.map(async (article) => ({
  //     ...article,
  //     content: await enrichArticleContent(article.url),
  //   }))
  // );

  return articles;
}
