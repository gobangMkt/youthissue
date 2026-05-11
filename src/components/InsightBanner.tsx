'use client';

import { Issue, PersonaType } from '@/types';

interface Props {
  issues: Issue[];
}

function getSummary(
  sorted: [string, number][],
  totalIssues: number
): string {
  const [topPersona, topCount] = sorted[0];
  const [secondPersona, secondCount] = sorted[1];
  const gap = topCount - secondCount;
  const ratio = topCount / totalIssues;

  if (ratio >= 0.7)
    return `이번 주는 ${topPersona} 관련 이슈가 압도적으로 많아요. 해당된다면 놓치지 마세요.`;
  if (gap <= 2)
    return `이번 주는 ${topPersona}과 ${secondPersona}에게 혜택이 고르게 분산된 주예요.`;
  if (gap >= 6)
    return `이번 주는 특히 ${topPersona}에게 좋은 소식이 집중됐어요.`;
  return `${topPersona}을 중심으로 다양한 혜택 이슈가 나온 한 주예요.`;
}

export default function InsightBanner({ issues }: Props) {
  if (issues.length === 0) return null;

  const personaWins: Record<PersonaType, number> = {
    '1인 가구': 0,
    '신혼부부': 0,
    '취업준비생': 0,
    '대학생': 0,
    '직장인': 0,
  };
  issues.forEach((i) => {
    i.personaImpacts.forEach((pi) => {
      if (pi.impact === 'positive' || pi.impact === 'very_positive') {
        personaWins[pi.persona] = (personaWins[pi.persona] ?? 0) + 1;
      }
    });
  });

  const sorted = Object.entries(personaWins).sort((a, b) => b[1] - a[1]);
  const max = sorted[0][1];
  const summary = getSummary(sorted, issues.length);

  return (
    <div className="bg-[#E9F8F8] rounded-[12px] px-4 py-4 space-y-3">
      {/* 바 차트 */}
      <p className="text-[13px] font-semibold text-[#20A6A6]">이번 주 페르소나별 유리한 이슈</p>
      <div className="space-y-2.5">
        {sorted.map(([persona, count], i) => (
          <div key={persona} className="flex items-center gap-2">
            <span className={`text-[13px] w-[68px] shrink-0 ${i === 0 ? 'font-bold text-[#161B30]' : 'text-[#4A5568]'}`}>
              {persona}
            </span>
            <div className="flex-1 bg-white rounded-full h-[8px] overflow-hidden">
              <div
                className={`h-full rounded-full ${i === 0 ? 'bg-[#25B9B9]' : 'bg-[#A8E3E3]'}`}
                style={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }}
              />
            </div>
            <span className={`text-[13px] w-6 text-right shrink-0 ${i === 0 ? 'font-bold text-[#25B9B9]' : 'text-[#8D9399]'}`}>
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* 분위기 요약 + 행동 유도 */}
      <div className="border-t border-[#C8EEEE] pt-3 space-y-1">
        <p className="text-[13px] text-[#161B30] leading-[1.6]">{summary}</p>
        <p className="text-[13px] text-[#8D9399]">해당 페르소나라면 아래 이슈 마감 전에 꼭 확인하세요.</p>
      </div>
    </div>
  );
}
