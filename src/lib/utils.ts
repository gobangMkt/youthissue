import { Category, ImpactLevel, Issue } from '@/types';

/**
 * 이슈의 "혜택 점수" 계산
 * 페르소나별 영향도를 숫자로 환산한 합계 (높을수록 더 많은 청년에게 유리한 정책)
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

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    '주거': 'bg-[#EBF5FF] text-[#2563EB]',
    '금융': 'bg-[#ECFDF5] text-[#059669]',
    '취업': 'bg-[#FFF7ED] text-[#D97706]',
    '복지': 'bg-[#F5F3FF] text-[#7C3AED]',
    '교육': 'bg-[#E0F8FA] text-[#00909D]',
  };
  return map[category] ?? 'bg-[#F2F4F6] text-[#4E5968]';
}

export function getCategoryFeaturedBg(category: Category): string {
  const map: Record<Category, string> = {
    '주거': 'bg-[#F0F7FF] hover:bg-[#E3F0FF]',
    '금융': 'bg-[#F0FDF6] hover:bg-[#E3FAF0]',
    '취업': 'bg-[#FFFBF0] hover:bg-[#FFF5DC]',
    '복지': 'bg-[#FAF5FF] hover:bg-[#F3EAFF]',
    '교육': 'bg-[#F5FCFD] hover:bg-[#EAF9FB]',
  };
  return map[category] ?? 'bg-[#F5FCFD] hover:bg-[#EAF9FB]';
}

export function getRankColor(rank: number): string {
  if (rank === 1) return 'text-[#F5A623]';
  if (rank === 2) return 'text-[#94A3B8]';
  if (rank === 3) return 'text-[#CD7F32]';
  return 'text-[#8B95A1]';
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
 * 영향도 뱃지 컬러 (고방 스타일: 그린/레드 + 톤 다운)
 */
export function getImpactColor(impact: ImpactLevel): string {
  const map: Record<ImpactLevel, string> = {
    very_positive: 'bg-[#00C73C] text-white',
    positive: 'bg-[#E8FBF0] text-[#00A030]',
    neutral: 'bg-[#F2F4F6] text-[#8B95A1]',
    negative: 'bg-[#FFF0F2] text-[#D92B2B]',
    very_negative: 'bg-[#F04452] text-white',
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
  if (change > 0) return { text: `▲${change}`, color: 'text-[#D92B2B]' };
  if (change < 0) return { text: `▼${Math.abs(change)}`, color: 'text-[#00B2C0]' };
  return { text: '―', color: 'text-[#B0B8C1]' };
}
