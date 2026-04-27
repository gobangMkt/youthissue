import { fetchAndClusterNews } from '../lib/news-fetcher';
import { summarizeArticle } from '../lib/gemini-summarizer';
import { generateIssueObject } from '../lib/issues-generator';
import { detectCategory } from '../lib/category-detector';
import * as fs from 'fs';
import * as path from 'path';
import { Issue } from '../types';

function loadPreviousIssues(): Issue[] {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'issues.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    // JSON 배열 부분만 추출
    const match = content.match(/export const issues: Issue\[\] = (\[[\s\S]*\]);/);
    if (!match) return [];
    return JSON.parse(match[1]) as Issue[];
  } catch {
    return [];
  }
}

// 이전 이슈 제목 → 순위 맵 생성 (첫 10글자 키로 퍼지 매칭)
function buildPrevRankMap(prev: Issue[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const issue of prev) {
    map.set(issue.title.substring(0, 15), issue.rank);
  }
  return map;
}

function findPrevRank(title: string, prevMap: Map<string, number>): number | null {
  const key = title.substring(0, 15);
  if (prevMap.has(key)) return prevMap.get(key)!;
  // 퍼지: 이전 키 중 현재 제목이 포함되거나 포함하는 것 검색
  for (const [prevKey, rank] of prevMap) {
    if (title.includes(prevKey) || prevKey.includes(key.substring(0, 8))) return rank;
  }
  return null;
}

async function writeIssuesToFile(issues: Issue[], updatedAt: string): Promise<void> {
  const filePath = path.join(__dirname, '..', 'data', 'issues.ts');

  const fileContent = `import { Issue } from '@/types';

// ⚠️ 이 파일은 매주 월요일 자동 생성됩니다.
// 수동 편집 시 다음 배치 실행 때 덮어쓰기됩니다.
// 배치 스크립트: src/scripts/fetch-and-summarize-issues.ts

export const lastUpdatedAt = '${updatedAt}';

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

    // 0. 이전 주 데이터 로드 (rankChange, isNew 계산용)
    const prevIssues = loadPreviousIssues();
    const prevRankMap = buildPrevRankMap(prevIssues);
    console.log(`[Prev] 이전 이슈 ${prevIssues.length}개 로드`);

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

    const now = new Date();
    const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    for (let idx = 0; idx < clusters.length; idx++) {
      const cluster = clusters[idx];
      const rep = cluster.articles[0]; // 대표 기사
      const currentRank = idx + 1;
      const prevRank = findPrevRank(rep.title, prevRankMap);
      const isNew = prevRank === null;
      // rankChange: 이전순위 - 현재순위 (양수=상승, 음수=하락)
      const rankChange = isNew ? 0 : prevRank - currentRank;

      // 모든 클러스터 기사의 본문을 합쳐서 Gemini에 전달 (여러 언론 교차 검증 효과)
      const combinedContent = cluster.articles
        .map((a) => `[${a.source}] ${a.title}\n${a.content || ''}`)
        .join('\n\n---\n\n')
        .substring(0, 6000);

      try {
        const summary = await summarizeArticle(rep.title, combinedContent);

        const issue = generateIssueObject(`${idx + 1}`, currentRank, {
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
          rankChange,
          isNew,
        });

        issues.push(issue);
        const changeLabel = isNew ? '🆕NEW' : rankChange > 0 ? `▲${rankChange}` : rankChange < 0 ? `▼${Math.abs(rankChange)}` : '―';
        console.log(`  ✓ [${idx + 1}/${clusters.length}] ${changeLabel} ${rep.title.substring(0, 40)}... (${cluster.pressCount}곳)`);
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
    await writeIssuesToFile(issues, updatedAt);

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
