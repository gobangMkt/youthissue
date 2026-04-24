/**
 * 테스트용 더미 Issue 데이터 생성 스크립트
 * Gemini API 키 없이 로컬 테스트할 때 사용
 *
 * 실행: npx tsx src/scripts/generate-dummy-issues.ts
 */

import { Issue } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const dummyIssues: Issue[] = [
  {
    id: '1',
    rank: 1,
    rankChange: 3,
    title: '신생아 특례대출 소득 기준 완화',
    category: '금융',
    tags: ['#대출', '#신혼부부', '#소득기준'],
    pressCount: 28,
    updatedAt: '2026-04-24 10:00',
    summary: [
      '정부가 신생아 특례대출의 소득 기준을 대폭 완화했습니다.',
      '기준 중위소득 100%에서 140%까지 확대되어 더 많은 신혼부부가 혜택을 받을 수 있습니다.',
      '신청 기간은 출생 후 6개월 이내로 제한됩니다.',
    ],
    checkpoints: [
      { label: '소득 기준', value: '기준 중위소득 140% 이하' },
      { label: '나이', value: '부부 모두 만 39세 이하' },
      { label: '대출 한도', value: '최대 8,000만원' },
      { label: '신청 기간', value: '출생 후 6개월 이내' },
    ],
    personaImpacts: [
      {
        persona: '1인 가구',
        impact: 'neutral',
        reason: '신생아 특례대출은 신혼부부 중심',
      },
      {
        persona: '신혼부부',
        impact: 'very_positive',
        reason: '소득 기준이 완화되어 더 많은 부부가 혜택 가능',
      },
      {
        persona: '취업준비생',
        impact: 'negative',
        reason: '소득 기준을 충족하기 어려움',
      },
      {
        persona: '대학생',
        impact: 'negative',
        reason: '혼인 요건을 충족하지 않음',
      },
      {
        persona: '직장인',
        impact: 'positive',
        reason: '중위소득 범위 내라면 신혼이후 대출 가능',
      },
    ],
    relatedBenefits: [],
    sources: [
      {
        title: '신생아 특례대출 소득기준 140%로 완화',
        press: '연합뉴스',
        url: 'https://search.naver.com/search.naver?where=news&query=신생아특례대출소득기준',
      },
    ],
    applyUrl: 'https://www.mofa.go.kr/',
    applyLabel: '신생아 특례대출 신청 →',
  },
  {
    id: '2',
    rank: 2,
    rankChange: 2,
    title: '청년 월세 지원 3차 모집',
    category: '주거',
    tags: ['#월세', '#청년주택'],
    pressCount: 21,
    updatedAt: '2026-04-24 10:00',
    summary: [
      '정부에서 청년 월세 지원 3차 모집을 개시했습니다.',
      '1인 가구와 신혼부부를 주 대상으로 월세를 보조합니다.',
      '신청 기간은 4월 25일부터 5월 9일까지 2주간입니다.',
    ],
    checkpoints: [
      { label: '대상', value: '1인 가구 및 신혼부부' },
      { label: '월세 지원액', value: '월 최대 40만원' },
      { label: '소득 기준', value: '기준 중위소득 100% 이하' },
      { label: '신청 기간', value: '4월 25일~5월 9일' },
    ],
    personaImpacts: [
      {
        persona: '1인 가구',
        impact: 'very_positive',
        reason: '1인 가구가 주 대상, 월세 부담 크게 감소',
      },
      {
        persona: '신혼부부',
        impact: 'very_positive',
        reason: '신혼부부 지원 강화, 월세 부담 완화',
      },
      {
        persona: '취업준비생',
        impact: 'positive',
        reason: '무소득이라도 부모 소득으로 판단되어 지원 가능',
      },
      {
        persona: '대학생',
        impact: 'neutral',
        reason: '기숙사가 있으면 월세 지원 대상 아님',
      },
      {
        persona: '직장인',
        impact: 'positive',
        reason: '중위소득 범위 내라면 월세 지원 가능',
      },
    ],
    relatedBenefits: [],
    sources: [
      {
        title: '청년 월세 지원 3차 모집 시작',
        press: '한국경제',
        url: 'https://search.naver.com/search.naver?where=news&query=청년월세지원',
      },
    ],
    applyUrl: 'https://www.mofa.go.kr/',
    applyLabel: '청년 월세 지원 신청 →',
  },
  {
    id: '3',
    rank: 3,
    rankChange: 1,
    title: '청년 취업 장려금 지원',
    category: '취업',
    tags: ['#취업', '#장려금'],
    pressCount: 15,
    updatedAt: '2026-04-24 10:00',
    summary: [
      '고용노동부가 청년 취업 장려금 지원을 확대했습니다.',
      '중소기업에 취업한 청년에게 월 100만원을 지원합니다.',
      '지원 기간은 취업 후 2년간이며, 총 2,400만원을 받을 수 있습니다.',
    ],
    checkpoints: [
      { label: '대상', value: '만 34세 이하 청년' },
      { label: '지원액', value: '월 100만원' },
      { label: '지원 기간', value: '2년(총 2,400만원)' },
      { label: '회사 규모', value: '중소기업(300명 이하)' },
    ],
    personaImpacts: [
      {
        persona: '1인 가구',
        impact: 'positive',
        reason: '취업 후 안정적인 생활 가능',
      },
      {
        persona: '신혼부부',
        impact: 'positive',
        reason: '부부 둘 다 취업하면 월 200만원 지원 가능',
      },
      {
        persona: '취업준비생',
        impact: 'very_positive',
        reason: '구직활동 장려금과 별도로 지원 가능',
      },
      {
        persona: '대학생',
        impact: 'positive',
        reason: '졸업 후 취업 시 최대 혜택 가능',
      },
      {
        persona: '직장인',
        impact: 'positive',
        reason: '이직 시에도 지원금 수령 가능',
      },
    ],
    relatedBenefits: [],
    sources: [
      {
        title: '청년 취업 장려금 월 100만원 지원',
        press: '뉴스1',
        url: 'https://search.naver.com/search.naver?where=news&query=청년취업장려금',
      },
    ],
    applyUrl: 'https://www.mofa.go.kr/',
    applyLabel: '취업 장려금 신청 →',
  },
];

function writeDummyIssuesToFile(issues: Issue[]): void {
  const filePath = path.join(__dirname, '..', 'data', 'issues.ts');

  const fileContent = `import { Issue } from '@/types';

export const issues: Issue[] = ${JSON.stringify(issues, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`✅ 더미 데이터로 ${filePath} 업데이트 (${issues.length}개 이슈)`);
}

console.log('🎯 테스트용 더미 Issue 데이터 생성 중...');
writeDummyIssuesToFile(dummyIssues);
console.log('✨ 완료! npm run dev로 프론트엔드 확인 가능합니다.');
