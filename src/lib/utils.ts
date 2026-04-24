import { Category, ImpactLevel } from '@/types';

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    주거: 'bg-blue-100 text-blue-700',
    금융: 'bg-emerald-100 text-emerald-700',
    취업: 'bg-orange-100 text-orange-700',
    복지: 'bg-purple-100 text-purple-700',
    교육: 'bg-rose-100 text-rose-700',
  };
  return map[category] ?? 'bg-gray-100 text-gray-700';
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

export function getImpactColor(impact: ImpactLevel): string {
  const map: Record<ImpactLevel, string> = {
    very_positive: 'bg-emerald-500 text-white',
    positive: 'bg-emerald-100 text-emerald-700',
    neutral: 'bg-gray-100 text-gray-500',
    negative: 'bg-red-100 text-red-600',
    very_negative: 'bg-red-500 text-white',
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
  if (change > 0) return { text: `▲${change}`, color: 'text-red-500' };
  if (change < 0) return { text: `▼${Math.abs(change)}`, color: 'text-blue-500' };
  return { text: '―', color: 'text-gray-400' };
}
