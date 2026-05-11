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
  const sortedPersonas = Object.entries(personaWins).sort((a, b) => b[1] - a[1]);
  const [topPersona, topPersonaCount] = sortedPersonas[0];
  const [secondPersona, secondPersonaCount] = sortedPersonas[1];

  const actionableCount = issues.filter(
    (i) =>
      i.checkpoints.filter(
        (cp) => !/명시되지 않음|제공되지 않음|판단할 수 없음/.test(cp.value)
      ).length > 0
  ).length;

  return (
    <div className="bg-[#E9F8F8] rounded-[12px] p-4 space-y-3">
      {/* 페르소나 2열 카드 */}
      <div className="grid grid-cols-2 gap-2">
        {([
          [topPersona, topPersonaCount],
          [secondPersona, secondPersonaCount],
        ] as [string, number][]).map(([persona, count]) => (
          <div key={persona} className="bg-white rounded-[10px] p-3 text-center">
            <p className="text-[30px] font-bold text-[#25B9B9] leading-none">{count}</p>
            <p className="text-[11px] text-[#8D9399] mt-0.5">유리한 이슈</p>
            <p className="text-[13px] font-bold text-[#161B30] mt-1">{persona}</p>
          </div>
        ))}
      </div>

      {/* 신청 가능 이슈 — 강조 바 */}
      <div className="bg-[#25B9B9] rounded-[10px] px-4 py-3 flex items-center justify-between">
        <p className="text-[14px] font-bold text-white">지금 신청 조건 있는 이슈</p>
        <p className="text-[26px] font-bold text-white leading-none">{actionableCount}<span className="text-[14px] font-medium ml-0.5">개</span></p>
      </div>
    </div>
  );
}
