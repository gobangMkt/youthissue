import { Issue, Category, PersonaImpact, KeyCheckpoint, SourceArticle } from '@/types';

export interface IssueGenerationInput {
  title: string;
  category: Category;
  summary: string[];
  checkpoints: KeyCheckpoint[];
  personaImpacts: PersonaImpact[];
  sources: SourceArticle[];
  applyUrl?: string;
  tags?: string[];
  pressCount?: number;
  rankChange?: number;
  isNew?: boolean;
}

export function generateIssueObject(
  id: string,
  rank: number,
  input: IssueGenerationInput
): Issue {
  const now = new Date();
  const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    id,
    rank,
    rankChange: input.rankChange ?? 0,
    isNew: input.isNew ?? false,
    title: input.title,
    category: input.category,
    tags: input.tags || [],
    pressCount: input.pressCount || 1,
    updatedAt,
    summary: input.summary.slice(0, 3),
    checkpoints: input.checkpoints.slice(0, 4),
    personaImpacts: input.personaImpacts,
    relatedBenefits: [],
    sources: input.sources,
    applyUrl: input.applyUrl || input.sources[0]?.url || '#',
    applyLabel: `${input.title.substring(0, 20)}... 자세히 보기 →`,
  };
}
