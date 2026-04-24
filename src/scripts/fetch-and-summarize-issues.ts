import { fetchYouthPolicyNews } from '../lib/news-fetcher';
import { summarizeArticle } from '../lib/gemini-summarizer';
import { generateIssueObject } from '../lib/issues-generator';
import { detectCategory } from '../lib/category-detector';
import * as fs from 'fs';
import * as path from 'path';
import { Issue } from '../types';

async function writeIssuesToFile(issues: Issue[]): Promise<void> {
  const filePath = path.join(__dirname, '..', 'data', 'issues.ts');

  const fileContent = `import { Issue } from '@/types';

export const issues: Issue[] = ${JSON.stringify(issues, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`[Writer] Updated ${filePath} with ${issues.length} issues`);
}

async function main() {
  try {
    console.log('='.repeat(60));
    console.log('📰 청년이슈 자동화 배치 시작');
    console.log('='.repeat(60));

    // 1. 기사 수집
    console.log('\n[Step 1/4] 기사 수집 중...');
    const articles = await fetchYouthPolicyNews(7);

    if (articles.length === 0) {
      console.warn('⚠️  기사를 찾을 수 없습니다. 종료합니다.');
      process.exit(1);
    }

    console.log(`✅ ${articles.length}개의 기사를 수집했습니다.\n`);

    // 2. 기사별 요약 생성 (병렬 처리)
    console.log('[Step 2/4] 기사 요약 생성 중 (Gemini API)...');
    const summaries = await Promise.allSettled(
      articles.map((article) =>
        summarizeArticle(article.title, article.content || article.title)
      )
    );

    const successSummaries: Array<{
      article: (typeof articles)[number];
      summary: Awaited<ReturnType<typeof summarizeArticle>>;
    }> = [];

    summaries.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        successSummaries.push({ article: articles[idx], summary: result.value });
      } else {
        console.warn(`⚠️  기사 요약 실패: ${articles[idx].title}`);
      }
    });

    console.log(`✅ ${successSummaries.length}개의 기사 요약을 생성했습니다.\n`);

    if (successSummaries.length === 0) {
      console.error('❌ 모든 기사 요약이 실패했습니다. Gemini API 키/모델을 확인하세요.');
      process.exit(1);
    }

    // 3. Issue 객체 배열 생성
    console.log('[Step 3/4] Issue 객체 생성 중...');
    const issues = successSummaries.map((item, idx) => {
      const { article, summary } = item;

      return generateIssueObject(`${idx + 1}`, idx + 1, {
        title: article.title,
        category: detectCategory(article.title),
        summary: summary.summary.length > 0 ? summary.summary : ['요약 생성 실패'],
        checkpoints: summary.checkpoints,
        personaImpacts: summary.personaImpacts,
        sources: [
          {
            title: article.title,
            press: article.source,
            url: article.url,
          },
        ],
        tags: summary.tags,
        pressCount: 1,
      });
    });

    console.log(`✅ ${issues.length}개의 Issue 객체를 생성했습니다.\n`);

    // 4. issues.ts 파일 업데이트
    console.log('[Step 4/4] issues.ts 파일 업데이트 중...');
    await writeIssuesToFile(issues);

    console.log('\n' + '='.repeat(60));
    console.log('✨ 배치 완료!');
    console.log('='.repeat(60));
    console.log(`📊 총 ${issues.length}개의 이슈가 업데이트되었습니다.`);
    console.log(`📅 업데이트 시간: ${new Date().toLocaleString('ko-KR')}`);
  } catch (error) {
    console.error('❌ 배치 실행 중 오류 발생:', error);
    process.exit(1);
  }
}

main();
