'use client';

import { Issue } from '@/types';

interface Props {
  issues: Issue[];
}

/**
 * 이번 주 청년 이슈 인사이트 배너
 * - 소제목 제거, 본문 가독성 향상
 * - 핵심 수치/단어 시각적 강조 (테일 컬러, 굵은 글씨)
 * - 2줄 구성: "이번 주 히트 이슈" + "규모"
 */
export default function InsightBanner({ issues }: Props) {
  if (issues.length === 0) return null;

  // 1위 이슈
  const top = issues[0];

  // 최다 카테고리
  const catCount = issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
  const [dominantCat] = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];

  // 전체 기사 수
  const totalPress = issues.reduce((sum, i) => sum + i.pressCount, 0);

  const topTitle =
    top.title.length > 22 ? top.title.substring(0, 22) + '…' : top.title;

  return (
    <div className="bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[12px] p-5">
      {/* 메인 인사이트 — 큰 글씨, 시각적 강조 */}
      <p className="text-[16px] text-[#191F28] leading-[1.5] font-semibold mb-3">
        이번 주엔{' '}
        <span className="text-[#00B2C0] font-bold">{dominantCat}</span>
        {' '}이슈가 가장 뜨거웠어요.
      </p>

      {/* 서브 인사이트 — 구분선 아래 */}
      <div className="pt-3 border-t border-[#A8E6EC] space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="text-[12px] text-[#8B95A1] shrink-0 w-[52px] pt-[2px]">1위</span>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[#191F28] font-bold leading-[1.45]">
              {topTitle}
            </p>
            <p className="text-[12px] text-[#4A5568] mt-0.5">
              언론사 <span className="text-[#00B2C0] font-bold">{top.pressCount}곳</span>에서 보도
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#8B95A1] shrink-0 w-[52px]">총 규모</span>
          <p className="text-[14px] text-[#191F28] font-semibold">
            <span className="text-[#00B2C0] font-bold">{issues.length}</span>개 이슈 ·{' '}
            <span className="text-[#00B2C0] font-bold">{totalPress}</span>건 기사
          </p>
        </div>
      </div>
    </div>
  );
}
