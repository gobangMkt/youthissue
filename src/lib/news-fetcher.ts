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

/**
 * 여러 기사를 하나의 이슈로 묶은 클러스터
 * pressCount = 보도한 언론사 수 (= 클러스터 크기)
 */
export interface NewsCluster {
  representativeTitle: string; // 대표 제목 (가장 최신)
  articles: RawArticle[];
  pressCount: number;
}

const YOUTH_KEYWORDS = [
  '청년주택', '청년혜택', '청년현실', '신생아특례', '전월세', '대출',
  '취업', '교육', '복지', '1인 가구', '신혼부부', '특례금리',
  '구직급여', '학자금', '청년 정책', '청년 지원', '주택 지원',
  '월세 지원',
];

// ============================================
// 1. RSS 기사 수집
// ============================================

function containsYouthKeyword(text: string): boolean {
  return YOUTH_KEYWORDS.some((k) => text.includes(k));
}

function extractSource(title: string): string {
  const match = title.match(/- ([^-]+)$/);
  return match ? match[1].trim() : '기타';
}

function stripSourceFromTitle(title: string): string {
  return title.replace(/\s*-\s*[^-]+$/, '').trim();
}

async function fetchGoogleNewsRSS(days: number): Promise<RawArticle[]> {
  const parser = new Parser({ timeout: 10000 });
  const queries = [
    '청년 정책', '청년 혜택', '청년 주택', '청년 월세',
    '신생아 특례', '청년 대출', '청년 취업', '청년 지원',
  ];

  const all: RawArticle[] = [];
  const seen = new Set<string>();
  const cutoff = new Date(Date.now() - days * 86400000);

  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`;
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        if (!item.title || !item.link) continue;
        const pub = item.pubDate ? new Date(item.pubDate) : new Date();
        if (pub < cutoff) continue;
        if (seen.has(item.link)) continue;
        seen.add(item.link);

        const fullTitle = item.title;
        const cleanTitle = stripSourceFromTitle(fullTitle);
        if (!containsYouthKeyword(cleanTitle)) continue;

        all.push({
          title: cleanTitle,
          url: item.link,
          source: extractSource(fullTitle),
          pubDate: pub.toISOString().substring(0, 10),
        });
      }
    } catch (err) {
      console.warn(`[Fetcher] RSS 실패 "${q}":`, (err as Error).message);
    }
  }

  return all;
}

// ============================================
// 2. 본문 보강 (실제 기사 스크래핑)
// ============================================

async function enrichArticleContent(url: string): Promise<string> {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
    });

    const $ = cheerio.load(res.data);

    // 불필요 태그 제거
    $('script, style, nav, header, footer, aside, iframe').remove();

    // 언론사별 공통 셀렉터 시도 (넓은 범위 → 좁은 범위)
    const selectors = [
      'article',
      '[itemprop="articleBody"]',
      '#articleBody', '#article_body', '#articeBody',
      '.article-body', '.articleBody', '.article_body', '.article-view',
      '.news_view', '.view_con', '#newsContent', '#news_content',
      '#contents', '.contents',
      'main',
    ];

    let body = '';
    for (const sel of selectors) {
      const text = $(sel).text().replace(/\s+/g, ' ').trim();
      if (text.length > 200) {
        body = text;
        break;
      }
    }

    // 폴백: body 전체에서 가장 긴 <p> 뭉치
    if (!body) {
      const ps = $('p').map((_, el) => $(el).text().trim()).get();
      body = ps.filter((t) => t.length > 40).join(' ');
    }

    return body.replace(/\s+/g, ' ').trim().substring(0, 2500);
  } catch {
    return '';
  }
}

async function enrichBatch(articles: RawArticle[], concurrency = 5): Promise<RawArticle[]> {
  const result: RawArticle[] = [];
  for (let i = 0; i < articles.length; i += concurrency) {
    const chunk = articles.slice(i, i + concurrency);
    const enriched = await Promise.all(
      chunk.map(async (a) => ({
        ...a,
        content: await enrichArticleContent(a.url),
      }))
    );
    result.push(...enriched);
  }
  return result;
}

// ============================================
// 3. 클러스터링 (제목 유사도 기반)
// ============================================

/**
 * 제목에서 의미있는 키워드 추출 (한국어 명사 위주)
 * 간단한 방식: 2글자 이상 연속 한글 토큰 추출 + 불용어 제거
 */
function extractKeywords(title: string): Set<string> {
  const STOPWORDS = new Set([
    '기자', '뉴스', '보도', '발표', '공고', '오늘', '어제', '내일',
    '정부', '시장', '지원', '정책', '추진', '확대', '관련', '지역',
    '이번', '올해', '지난', '한국', '서울', '부산', '대구', '최근',
  ]);

  const tokens = title.match(/[가-힣]{2,}/g) ?? [];
  return new Set(tokens.filter((t) => !STOPWORDS.has(t) && t.length >= 2));
}

/** Jaccard 유사도: 0~1, 1이면 완전 동일 */
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  a.forEach((v) => { if (b.has(v)) inter++; });
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * 기사들을 이슈 클러스터로 묶음
 * 임계값(0.35) 이상 유사한 제목끼리 같은 클러스터
 */
export function clusterArticles(articles: RawArticle[], threshold = 0.35): NewsCluster[] {
  const withKw = articles.map((a) => ({ article: a, kw: extractKeywords(a.title) }));
  const clusters: { articles: RawArticle[]; keywords: Set<string> }[] = [];

  for (const { article, kw } of withKw) {
    // 가장 유사한 기존 클러스터 찾기
    let bestIdx = -1;
    let bestSim = 0;
    for (let i = 0; i < clusters.length; i++) {
      const sim = jaccard(kw, clusters[i].keywords);
      if (sim > bestSim) {
        bestSim = sim;
        bestIdx = i;
      }
    }

    if (bestIdx >= 0 && bestSim >= threshold) {
      // 기존 클러스터에 추가
      clusters[bestIdx].articles.push(article);
      kw.forEach((k) => clusters[bestIdx].keywords.add(k));
    } else {
      // 새 클러스터 생성
      clusters.push({ articles: [article], keywords: new Set(kw) });
    }
  }

  // 각 클러스터에서 같은 언론사 중복 제거 (같은 언론사가 같은 이슈를 여러번 쓴 경우 1개로)
  return clusters
    .map((c) => {
      const uniqBySrc = new Map<string, RawArticle>();
      for (const a of c.articles) {
        const key = a.source + '||' + a.title.substring(0, 30);
        if (!uniqBySrc.has(key)) uniqBySrc.set(key, a);
      }
      const uniqArticles = Array.from(uniqBySrc.values());
      return {
        representativeTitle: uniqArticles[0].title,
        articles: uniqArticles,
        pressCount: uniqArticles.length,
      };
    })
    .sort((a, b) => b.pressCount - a.pressCount);
}

// ============================================
// 4. 통합 실행
// ============================================

export async function fetchYouthPolicyNews(days: number = 7): Promise<RawArticle[]> {
  console.log(`[Fetcher] 지난 ${days}일 기사 수집 중...`);
  const articles = await fetchGoogleNewsRSS(days);
  console.log(`[Fetcher] 수집 & 필터링 완료: ${articles.length}개`);
  return articles;
}

/**
 * 진짜 파이프라인: 수집 → 본문 보강 → 클러스터링
 */
export async function fetchAndClusterNews(days: number = 7, topN: number = 15): Promise<NewsCluster[]> {
  console.log(`[Fetcher] 지난 ${days}일 기사 수집...`);
  const raw = await fetchGoogleNewsRSS(days);
  console.log(`[Fetcher] → ${raw.length}개 수집`);

  console.log(`[Enricher] 본문 스크래핑... (병렬 5개씩)`);
  const enriched = await enrichBatch(raw, 5);
  const withContent = enriched.filter((a) => a.content && a.content.length > 100);
  console.log(`[Enricher] → 본문 확보: ${withContent.length}개 / ${enriched.length}개`);

  console.log(`[Cluster] 제목 유사도로 이슈 그룹핑...`);
  const clusters = clusterArticles(withContent.length > 0 ? withContent : enriched);
  console.log(`[Cluster] → ${clusters.length}개 이슈로 묶임`);

  const top = clusters.slice(0, topN);
  top.forEach((c, i) => {
    console.log(`  #${i + 1} [${c.pressCount}곳] ${c.representativeTitle.substring(0, 50)}...`);
  });

  return top;
}
