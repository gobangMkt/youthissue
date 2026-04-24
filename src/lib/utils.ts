import { Category, ImpactLevel } from '@/types';

/**
 * 고방 디자인 토큰 기반 카테고리 색상
 * 모든 값은 globals.css의 --color-cat-* 토큰 참조
 */
export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    주거: 'bg-[#E0F8FA] text-[#1A7A85]',
    금융: 'bg-[#E8FBF0] text-[#00A030]',
    취업: 'bg-[#FFF4E0] text-[#B86300]',
    복지: 'bg-[#EDE9FF] text-[#5B35C7]',
    교육: 'bg-[#FFF0F2] text-[#D92B2B]',
  };
  return map[category] ?? 'bg-[#F2F4F6] text-[#4A5568]';
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
