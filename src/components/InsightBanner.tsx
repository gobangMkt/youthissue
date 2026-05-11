'use client';

import { Issue, PersonaType } from '@/types';

interface Props {
  issues: Issue[];
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

  return (
    <div className="bg-[#E9F8F8] rounded-[12px] px-4 py-4 space-y-2.5">
      <p className="text-[13px] font-semibold text-[#20A6A6] mb-1">이번 주 페르소나별 유리한 이슈</p>
      {sorted.map(([persona, count], i) => (
        <div key={persona} className="flex items-center gap-2">
          <span className={`text-[13px] w-[68px] shrink-0 ${i === 0 ? 'font-bold text-[#161B30]' : 'text-[#4A5568]'}`}>
            {persona}
          </span>
          <div className="flex-1 bg-white rounded-full h-[8px] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${i === 0 ? 'bg-[#25B9B9]' : 'bg-[#A8E3E3]'}`}
              style={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }}
            />
          </div>
          <span className={`text-[13px] w-6 text-right shrink-0 ${i === 0 ? 'font-bold text-[#25B9B9]' : 'text-[#8D9399]'}`}>
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
