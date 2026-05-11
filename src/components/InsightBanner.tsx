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
    <div className="bg-[#E9F8F8] rounded-[12px] p-5">
      <div className="space-y-2">
        <p className="text-[15px] text-[#20A6A6] leading-[1.6]">
          특히{' '}
          <span className="font-bold text-[#25B9B9]">{topPersona}</span>
          <span className="font-medium">({topPersonaCount}건)</span>,{' '}
          <span className="font-bold text-[#25B9B9]">{secondPersona}</span>
          <span className="font-medium">({secondPersonaCount}건)</span>에게 유리한 이슈가 많아요.
        </p>
        <p className="text-[15px] text-[#20A6A6] leading-[1.6]">
          <span className="font-bold text-[#25B9B9]">{actionableCount}개 이슈</span>는 신청 조건·금액이
          구체적이니, 마감 놓치기 전에 꼭 확인해보세요.
        </p>
      </div>
    </div>
  );
}
