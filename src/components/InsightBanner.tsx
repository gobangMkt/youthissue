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
    <div className="bg-[#E9F8F8] rounded-[12px] p-5 space-y-4">
      {/* 페르소나 stat */}
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-16 text-right">
          <span className="text-[32px] font-bold text-[#25B9B9] leading-none">{topPersonaCount}</span>
          <span className="text-[14px] text-[#20A6A6] font-medium">건</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#161B30] leading-snug">
            <span className="text-[#25B9B9]">{topPersona}</span>에게 가장 유리해요
          </p>
          <p className="text-[13px] text-[#8D9399] mt-0.5">
            2위 {secondPersona} {secondPersonaCount}건
          </p>
        </div>
      </div>

      <div className="border-t border-[#C8EEEE]" />

      {/* 실행 가능 stat */}
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-16 text-right">
          <span className="text-[32px] font-bold text-[#25B9B9] leading-none">{actionableCount}</span>
          <span className="text-[14px] text-[#20A6A6] font-medium">개</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#161B30] leading-snug">신청 조건이 구체적이에요</p>
          <p className="text-[13px] text-[#8D9399] mt-0.5">마감 놓치기 전에 꼭 확인해보세요</p>
        </div>
      </div>
    </div>
  );
}
