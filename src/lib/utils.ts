import { Category, ImpactLevel, Issue } from '@/types';

/**
 * 이슈의 "혜택 점수" 계산
 *   매우긍정 = +2, 긍정 = +1, 해당없음 = 0, 부정 = -1, 매우부정 = -2
 */
export function getBenefitScore(issue: Issue): number {
  const scoreMap: Record<ImpactLevel, number> = {
    very_positive: 2,
    positive: 1,
    neutral: 0,
    negative: -1,
    very_negative: -2,
  };
  return issue.personaImpacts.reduce(
    (sum, pi) => sum + (scoreMap[pi.impact] ?? 0),
    0
  );
}

/**
 * Mint Design — 카테고리 칩
 * Skyblue / Green / Orange / Purple / Red 팔레트의 -10 / -100 단계 사용
 */
export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    '주거': 'bg-[#E9F6FA] text-[#0098D4]',
    '금융': 'bg-[#E8F7EB] text-[#1EA93C]',
    '취업': 'bg-[#FCF1E8] text-[#EF6E0E]',
    '복지': 'bg-[#F3EDFE] text-[#5200CC]',
    '교육': 'bg-[#FFF2F0] text-[#EC3B28]',
  };
  return map[category] ?? 'bg-[#F5F6F7] text-[#555B61]';
}

/**
 * featured 카드 배경(은은한 wash) — 동일 팔레트 -10 / -20 단계
 */
export function getCategoryFeaturedBg(category: Category): string {
  const map: Record<Category, string> = {
    '주거': 'bg-[#E9F6FA] hover:bg-[#CAEEFA]',
    '금융': 'bg-[#E8F7EB] hover:bg-[#D3EFDA]',
    '취업': 'bg-[#FCF1E8] hover:bg-[#FCEADC]',
    '복지': 'bg-[#F3EDFE] hover:bg-[#E5D9FE]',
    '교육': 'bg-[#FFF2F0] hover:bg-[#FFEEEC]',
  };
  return map[category] ?? 'bg-[#F4FBFB] hover:bg-[#E9F8F8]';
}

export function getRankColor(rank: number): string {
  if (rank === 1) return 'text-[#F7AC00]';
  if (rank === 2) return 'text-[#B1B6BC]';
  if (rank === 3) return 'text-[#EF6E0E]';
  return 'text-[#8D9399]';
}

export function getImpactLabel(impact: ImpactLevel): string {
  const map: Record<ImpactLevel, string> = {
    very_positive: '매우 긍정',
    positive: '긍정',
    neutral: '해당없음',
    negative: '부정',
    very_negative: '매우 부정',
  };
  return map[impact];
}

/**
 * 영향도 뱃지 컬러 (Mint Design Green / Red 톤)
 */
export function getImpactColor(impact: ImpactLevel): string {
  const map: Record<ImpactLevel, string> = {
    very_positive: 'bg-[#2DB44A] text-white',
    positive: 'bg-[#E8F7EB] text-[#1EA93C]',
    neutral: 'bg-[#F5F6F7] text-[#8D9399]',
    negative: 'bg-[#FFF2F0] text-[#EC3B28]',
    very_negative: 'bg-[#FF513E] text-white',
  };
  return map[impact];
}

export function getImpactIcon(impact: ImpactLevel): string {
  const map: Record<ImpactLevel, string> = {
    very_positive: '🔥',
    positive: '✅',
    neutral: '➖',
    negative: '⚠️',
    very_negative: '🚨',
  };
  return map[impact];
}

export function getRankChangeDisplay(change: number): { text: string; color: string } {
  if (change > 0) return { text: `▲${change}`, color: 'text-[#EC3B28]' };
  if (change < 0) return { text: `▼${Math.abs(change)}`, color: 'text-[#25B9B9]' };
  return { text: '―', color: 'text-[#B1B6BC]' };
}
