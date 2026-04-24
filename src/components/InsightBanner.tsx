'use client';

import { Issue, PersonaType } from '@/types';

interface Props {
  issues: Issue[];
}

/**
 * 이번 주 청년 이슈 인사이트 배너
 * - 리스트만 봐도 아는 정보(1위 제목 등) 금지
 * - 실제 가치: 트렌드 · 페르소나별 꿀팁 · 실용 정보
 */
export default function InsightBanner({ issues }: Props) {
  if (issues.length === 0) return null;

  // ───────────────────────────────────────
  // 1) 정책 방향성: 요약/체크포인트에서 "확대·상향·완화" 키워드 집계
  const EXPANSION_PATTERNS = /확대|상향|늘어|올려|완화|인상|증액|신설|강화/;
  const expandingCount = issues.filter(
    (i) =>
      i.summary.some((s) => EXPANSION_PATTERNS.test(s)) ||
      i.checkpoints.some((cp) => EXPANSION_PATTERNS.test(cp.value))
  ).length;

  // ───────────────────────────────────────
  // 2) 페르소나별 "유리한 이슈" 개수 (긍정 + 매우긍정)
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

  // ───────────────────────────────────────
  // 3) 실행 가능 이슈(구체 조건이 명시된 이슈) 수
  const actionableCount = issues.filter(
    (i) =>
      i.checkpoints.filter(
        (cp) => !/명시되지 않음|제공되지 않음|판단할 수 없음/.test(cp.value)
      ).length > 0
  ).length;

  return (
    <div className="bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[12px] p-5">
      {/* 1. 트렌드 — 가장 큰 글씨 */}
      <p className="text-[16px] text-[#191F28] leading-[1.5] font-semibold mb-3">
        이번 주엔 <span className="text-[#00B2C0] font-bold">지원 확대</span> 소식이{' '}
        <span className="text-[#00B2C0] font-bold">{expandingCount}건</span>.
        <br />
        청년 혜택이 넓어지는 분위기예요.
      </p>

      {/* 2. 페르소나 꿀팁 */}
      <div className="pt-3 border-t border-[#A8E6EC] space-y-2">
        <p className="text-[13px] text-[#1A7A85] leading-[1.6]">
          특히{' '}
          <span className="font-bold text-[#00B2C0]">{topPersona}</span>
          <span className="font-semibold">({topPersonaCount}건)</span>,{' '}
          <span className="font-bold text-[#00B2C0]">{secondPersona}</span>
          <span className="font-semibold">({secondPersonaCount}건)</span>에게 유리한 이슈가 많아요.
        </p>

        {/* 3. 실행 팁 */}
        <p className="text-[13px] text-[#1A7A85] leading-[1.6]">
          <span className="font-bold text-[#00B2C0]">{actionableCount}개 이슈</span>는 신청 조건·금액이
          구체적이니, 마감 놓치기 전에 꼭 확인해보세요.
        </p>
      </div>
    </div>
  );
}
