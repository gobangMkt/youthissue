'use client';

import { useMemo, useState } from 'react';
import IssueCard from '@/components/IssueCard';
import InsightBanner from '@/components/InsightBanner';
import { issues } from '@/data/issues';
import { Category, ImpactLevel } from '@/types';
import { getBenefitScore } from '@/lib/utils';

const CATEGORIES: (Category | '전체')[] = ['전체', '주거', '금융', '취업', '복지', '교육'];

type SortMode = 'press' | 'benefit';

// 영향도 등급 체계 (혜택순 탭에서 툴팁으로 표시)
const IMPACT_GRADES: { label: string; impact: ImpactLevel; score: string; desc: string }[] = [
  { label: '매우 긍정', impact: 'very_positive', score: '+2', desc: '대상 확실 · 실질 혜택 큼' },
  { label: '긍정', impact: 'positive', score: '+1', desc: '일부 해당 · 혜택 가능' },
  { label: '해당없음', impact: 'neutral', score: '0', desc: '직접 연관 거의 없음' },
  { label: '부정', impact: 'negative', score: '−1', desc: '조건상 불리하거나 대상 제외' },
  { label: '매우 부정', impact: 'very_negative', score: '−2', desc: '정책상 명확히 손해' },
];

/**
 * 고방 디자인 시스템:
 * - 회색 페이지 배경 + 흰색 섹션 카드 (8px 갭)
 * - 토스 보이스앤톤
 */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | '전체'>('전체');
  const [sortMode, setSortMode] = useState<SortMode>('press');
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // 카테고리 필터 + 정렬
  const filtered = useMemo(() => {
    const list =
      activeCategory === '전체'
        ? [...issues]
        : issues.filter((i) => i.category === activeCategory);

    if (sortMode === 'press') {
      return list.sort((a, b) => b.pressCount - a.pressCount);
    }
    // 혜택순: 긍정 점수 합계 내림차순, 같으면 pressCount로 보조
    return list.sort((a, b) => {
      const diff = getBenefitScore(b) - getBenefitScore(a);
      return diff !== 0 ? diff : b.pressCount - a.pressCount;
    });
  }, [activeCategory, sortMode]);

  // 정렬 후 rank 재매김하기 위해 index 사용
  const reRanked = filtered.map((issue, idx) => ({ ...issue, rank: idx + 1 }));
  const featured = reRanked.slice(0, 3);
  const visibleRest = reRanked.slice(3, 5);
  const hiddenRest = reRanked.slice(5);

  return (
    <main className="max-w-[480px] mx-auto min-h-screen pb-8">
      {/* Section 1: Hero */}
      <section className="bg-white px-5 pt-5 pb-5">
        <h1 className="text-[20px] font-bold text-[#191F28] mb-1">
          오늘의 청년이슈 TOP {issues.length}
        </h1>
        <p className="text-[13px] text-[#8B95A1]">매주 월요일 09:00 갱신 · 지난 7일 기사 분석</p>
      </section>

      {/* Section 2: 주간 인사이트 배너 */}
      <section className="bg-white mt-2 px-5 py-4">
        <InsightBanner issues={issues} />
      </section>

      {/* Section 3: 카테고리 필터 */}
      <section className="bg-white mt-2 px-5 py-4">
        <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px] mb-3">카테고리</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowMore(false); }}
              className={`shrink-0 px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#00B2C0] text-white'
                  : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="bg-white mt-2 px-5 py-16 text-center text-[#8B95A1] text-[14px]">
          해당 카테고리의 이슈가 없습니다.
        </section>
      ) : (
        <>
          {/* Section 4: 정렬 토글 + 랭킹 리스트 */}
          <section className="bg-white mt-2 px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px]">
                TOP {filtered.length} 랭킹
              </p>
            </div>

            {/* 정렬 탭 */}
            <div className="flex gap-1 bg-[#F2F4F6] rounded-[10px] p-1 mb-3">
              <button
                onClick={() => { setSortMode('press'); setShowMore(false); }}
                className={`flex-1 py-2 rounded-[8px] text-[12px] font-bold transition-colors ${
                  sortMode === 'press'
                    ? 'bg-white text-[#00B2C0] shadow-sm'
                    : 'text-[#8B95A1] hover:text-[#4E5968]'
                }`}
              >
                기사 수 순
              </button>
              <button
                onClick={() => { setSortMode('benefit'); setShowMore(false); }}
                className={`flex-1 py-2 rounded-[8px] text-[12px] font-bold transition-colors flex items-center justify-center gap-1 ${
                  sortMode === 'benefit'
                    ? 'bg-white text-[#00B2C0] shadow-sm'
                    : 'text-[#8B95A1] hover:text-[#4E5968]'
                }`}
              >
                혜택 많은 순
                {sortMode === 'benefit' && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGradeInfo((v) => !v);
                    }}
                    role="button"
                    aria-label="영향도 등급 설명"
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E0F8FA] text-[#00B2C0] text-[10px] font-bold cursor-pointer hover:bg-[#A8E6EC]"
                  >
                    ?
                  </span>
                )}
              </button>
            </div>

            {/* 영향도 등급 툴팁 (혜택순 선택 + ? 클릭 시) */}
            {sortMode === 'benefit' && showGradeInfo && (
              <div className="mb-3 bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[10px] p-4">
                <p className="text-[13px] font-bold text-[#1A7A85] mb-2">영향도 등급이 뭐예요?</p>
                <p className="text-[12px] text-[#1A7A85] leading-[1.6] mb-3">
                  5개 페르소나(1인 가구·신혼부부·취업준비생·대학생·직장인) 각각에 대해 기사를 분석해,
                  얼마나 유리한지 판단해요. 점수가 높을수록 더 많은 청년에게 좋은 정책이에요.
                </p>
                <div className="space-y-1">
                  {IMPACT_GRADES.map((g) => (
                    <div key={g.impact} className="flex items-start gap-2 text-[12px]">
                      <span className="shrink-0 w-14 font-bold text-[#1A7A85]">{g.label}</span>
                      <span className="shrink-0 w-8 font-mono text-[#00B2C0]">{g.score}</span>
                      <span className="text-[#4A5568]">{g.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOP 3: 테일 tint 배경으로 강조 */}
            {featured.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {featured.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} featured />
                ))}
              </div>
            )}
            {/* 4~5위: 항상 노출 */}
            {visibleRest.length > 0 && (
              <div className="divide-y divide-[#F2F4F6]">
                {visibleRest.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
            {/* 6위~: 더보기로 펼치기 */}
            {hiddenRest.length > 0 && (
              <>
                {showMore && (
                  <div className="divide-y divide-[#F2F4F6]">
                    {hiddenRest.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowMore((v) => !v)}
                  className="w-full mt-3 py-3 rounded-[10px] bg-[#F2F4F6] text-[13px] font-semibold text-[#4E5968] hover:bg-[#E5E8EB] transition-colors"
                >
                  {showMore ? '접기' : `더보기 (${hiddenRest.length}개)`}
                </button>
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}
