import { fetchAndClusterNews } from '../lib/news-fetcher';
import { summarizeArticle } from '../lib/gemini-summarizer';
import { generateIssueObject } from '../lib/issues-generator';
import { detectCategory } from '../lib/category-detector';
import * as fs from 'fs';
import * as path from 'path';
import { Issue } from '../types';

async function writeIssuesToFile(issues: Issue[]): Promise<void> {
  const filePath = path.join(__dirname, '..', 'data', 'issues.ts');

  const fileContent = `import { Issue } from '@/types';

// ⚠️ 이 파일은 매주 월요일 자동 생성됩니다.
// 수동 편집 시 다음 배치 실행 때 덮어쓰기됩니다.
// 배치 스크립트: src/scripts/fetch-and-summarize-issues.ts

export const issues: Issue[] = ${JSON.stringify(issues, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`[Writer] ${filePath} 업데이트 — ${issues.length}개 이슈`);
}

async function main() {
  try {
    console.log('='.repeat(60));
    console.log('📰 청년이슈 자동화 배치 시작');
    console.log('='.repeat(60));

    // 1. 수집 + 본문 스크래핑 + 클러스터링 (언론사 보도 수 기반 TOP)
    console.log('\n[Step 1/3] 기사 수집 & 클러스터링');
    const clusters = await fetchAndClusterNews(7, 25, 2);

    if (clusters.length === 0) {
      console.error('❌ 이슈를 찾을 수 없습니다.');
      process.exit(1);
    }

    // 2. 각 클러스터의 대표 기사를 Gemini로 요약
    console.log(`\n[Step 2/3] Gemini 2.5 Flash로 요약 생성 (${clusters.length}건)`);
    const issues: Issue[] = [];

    for (let idx = 0; idx < clusters.length; idx++) {
      const cluster = clusters[idx];
      const rep = cluster.articles[0]; // 대표 기사

      // 모든 클러스터 기사의 본문을 합쳐서 Gemini에 전달 (여러 언론 교차 검증 효과)
      const combinedContent = cluster.articles
        .map((a) => `[${a.source}] ${a.title}\n${a.content || ''}`)
        .join('\n\n---\n\n')
        .substring(0, 6000);

      try {
        const summary = await summarizeArticle(rep.title, combinedContent);

        const issue = generateIssueObject(`${idx + 1}`, idx + 1, {
          title: rep.title,
          category: detectCategory(rep.title),
          summary: summary.summary.length > 0 ? summary.summary : ['요약 생성 실패'],
          checkpoints: summary.checkpoints,
          personaImpacts: summary.personaImpacts,
          sources: cluster.articles.map((a) => ({
            title: a.title,
            press: a.source,
            url: a.url,
          })),
          tags: summary.tags,
          pressCount: cluster.pressCount,
        });

        issues.push(issue);
        console.log(`  ✓ [${idx + 1}/${clusters.length}] ${rep.title.substring(0, 40)}... (${cluster.pressCount}곳)`);
      } catch (err) {
        console.warn(`  ✗ [${idx + 1}/${clusters.length}] 요약 실패: ${(err as Error).message}`);
      }
    }

    if (issues.length === 0) {
      console.error('❌ 모든 요약이 실패했습니다.');
      process.exit(1);
    }

    // 3. issues.ts 파일 업데이트
    console.log(`\n[Step 3/3] issues.ts 파일 업데이트`);
    await writeIssuesToFile(issues);

    console.log('\n' + '='.repeat(60));
    console.log(`✨ 배치 완료! 총 ${issues.length}개 이슈 업데이트`);
    console.log(`📅 ${new Date().toLocaleString('ko-KR')}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ 배치 실행 중 오류:', error);
    process.exit(1);
  }
}

main();
