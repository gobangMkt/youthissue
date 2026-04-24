'use client';

import { Issue } from '@/types';

interface Props {
  issues: Issue[];
}

/**
 * 이번 주 청년 이슈 인사이트 배너
 * - 닫기 X (항상 노출)
 * - 토스 톤, 2~3줄 분량
 * - 데이터에서 동적으로 계산 (카테고리 분포, 최다 보도, 긍정 이슈 비율)
 */
export default function InsightBanner({ issues }: Props) {
  if (issues.length === 0) return null;

  // 1위 이슈
  const top = issues[0];

  // 가장 많은 카테고리
  const catCount = issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
  const dominantCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];

  // 전체 언론 보도량
  const totalPress = issues.reduce((sum, i) => sum + i.pressCount, 0);

  return (
    <div className="bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[10px] p-4">
      <p className="text-[13px] font-bold text-[#1A7A85] mb-2 flex items-center gap-1.5">
        <span>📬</span>
        <span>이번 주 청년 이슈, 한눈에 봐요</span>
      </p>
      <div className="space-y-1.5">
        <p className="text-[13px] text-[#1A7A85] leading-[1.6]">
          이번 주는{' '}
          <strong className="font-bold">{dominantCat[0]}</strong> 관련 이슈가 가장 뜨거웠어요
          <span className="text-[#4A5568]"> ({dominantCat[1]}건).</span>
        </p>
        <p className="text-[13px] text-[#1A7A85] leading-[1.6]">
          그중에서도{' '}
          <strong className="font-bold">&ldquo;{top.title.length > 28 ? top.title.substring(0, 28) + '…' : top.title}&rdquo;</strong>
          {' '}이슈가 <strong className="font-bold">{top.pressCount}곳</strong>에서 보도됐답니다.
        </p>
        <p className="text-[13px] text-[#1A7A85] leading-[1.6]">
          총 {issues.length}개 이슈, {totalPress}건의 기사를 정리했으니 편하게 훑어보세요.
        </p>
      </div>
    </div>
  );
}
