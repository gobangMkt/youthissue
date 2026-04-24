import { Category } from '@/types';

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  주거: ['주택', '주거', '월세', '전월세', '전셋값', '주택금', '주택담보', '집', '아파트', '전세'],
  금융: ['대출', '금리', '차입', '금융', '이율', '특례금', '금융지원', '대출금리', '이자'],
  취업: ['취업', '일자리', '고용', '채용', '구직', '직업', '일하', '근무', '직장', '고용보험'],
  복지: ['복지', '수당', '지원금', '장려금', '지급', '혜택', '보조', '급여', '지원'],
  교육: ['교육', '학자금', '대학', '학교', '장학금', '교육비', '등록금', '학위'],
};

export function detectCategory(title: string): Category {
  const lowerTitle = title.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return category as Category;
      }
    }
  }

  // 기본값
  return '복지';
}
