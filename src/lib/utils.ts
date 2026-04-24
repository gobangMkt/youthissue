import { Category, ImpactLevel } from '@/types';

/**
 * 고방 디자인 원칙: "한 가지 primary"
 * 모든 카테고리 뱃지를 중립 회색으로 통일 (토스피드 스타일)
 * 알록달록함 제거 — 시각적 노이즈 최소화
 */
export function getCategoryColor(_category: Category): string {
  return 'bg-[#F2F4F6] text-[#4E5968]';
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
