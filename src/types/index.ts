export type Category = '주거' | '금융' | '취업' | '복지' | '교육';

export type PersonaType = '1인 가구' | '신혼부부' | '취업준비생' | '대학생' | '직장인';

export type ImpactLevel = 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';

export interface PersonaImpact {
  persona: PersonaType;
  impact: ImpactLevel;
  reason: string;
}

export interface KeyCheckpoint {
  label: string;
  value: string;
}

export interface RelatedBenefit {
  id: string;
  title: string;
  category: Category;
  url: string;
}

export interface SourceArticle {
  title: string;
  press: string;
  url: string;
}

export interface Issue {
  id: string;
  rank: number;
  rankChange: number; // 양수=상승, 0=유지, 음수=하락
  title: string;
  category: Category;
  tags: string[];
  pressCount: number;
  updatedAt: string;
  summary: string[]; // 3줄 요약
  checkpoints: KeyCheckpoint[];
  personaImpacts: PersonaImpact[];
  relatedBenefits: RelatedBenefit[];
  sources: SourceArticle[];
  applyUrl: string;
  applyLabel: string;
}
