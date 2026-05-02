'use client';

import { useMemo, useState } from 'react';
import IssueCard from '@/components/IssueCard';
import InsightBanner from '@/components/InsightBanner';
import { issues, lastUpdatedAt } from '@/data/issues';
import { Category, ImpactLevel } from '@/types';
import { getBenefitScore } from '@/lib/utils';

const CATEGORIES: (Category | '전체')[] = ['전체', '주거', '금융', '취업', '복지', '교육'];

type SortMode = 'press' | 'benefit';

const IMPACT_GRADES: { label: string; impact: ImpactLevel; score: string; desc: string }[] = [
  { label: '매우 긍정', impact: 'very_positive', score: '+2', desc: '대상 확실 · 실질 혜택 큼' },
  { label: '긍정', impact: 'positive', score: '+1', desc: '일부 해당 · 혜택 가능' },
  { label: '해당없음', impact: 'neutral', score: '0', desc: '직접 연관 거의 없음' },
  { label: '부정', impact: 'negative', score: '−1', desc: '조건상 불리하거나 대상 제외' },
  { label: '매우 부정', impact: 'very_negative', score: '−2', desc: '정책상 명확히 손해' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | '전체'>('전체');
  const [sortMode, setSortMode] = useState<SortMode>('press');
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const filtered = useMemo(() => {
    const list =
      activeCategory === '전체'
        ? [...issues]
        : issues.filter((i) => i.category === activeCategory);

    if (sortMode === 'press') {
      return list.sort((a, b) => b.pressCount - a.pressCount);
    }
    return list.sort((a, b) => {
      const diff = getBenefitScore(b) - getBenefitScore(a);
      return diff !== 0 ? diff : b.pressCount - a.pressCount;
    });
  }, [activeCategory, sortMode]);

  const reRanked = filtered.map((issue, idx) => ({ ...issue, rank: idx + 1 }));
  const featured = reRanked.slice(0, 3);
  const visibleRest = reRanked.slice(3, 5);
  const hiddenRest = reRanked.slice(5);

  return (
    <main className="max-w-[480px] mx-auto min-h-screen pb-8">
      {/* Section 1: Hero */}
      <section className="bg-white px-4 pt-5 pb-5">
        <h1 className="text-[20px] font-bold text-[#161B30] leading-[1.5] mb-1">
          이번 주 청년이슈 TOP {issues.length}
        </h1>
        <div className="flex items-center gap-1.5">
          <p className="text-[14px] text-[#B1B6BC]">업데이트 {lastUpdatedAt.replace(/-/g, '.').substring(0, 10)}</p>
          <div className="relative group">
            <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-[#F5F6F7] text-[#B1B6BC] text-[9px] font-bold cursor-default select-none">?</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block z-10 w-[200px] bg-[#161B30] text-white text-[13px] leading-[1.5] rounded-[8px] px-3 py-2 shadow-[0_4px_16px_rgba(17,17,17,0.18)] pointer-events-none">
              매주 월요일 06:00 갱신<br />지난 7일 기사 AI 분석
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#161B30]" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 주간 인사이트 배너 */}
      <section className="bg-white mt-2 px-4 py-4">
        <InsightBanner issues={issues} />
      </section>

      {/* Section 3: 카테고리 필터 */}
      <section className="bg-white mt-2 px-4 py-4">
        <p className="text-[14px] font-medium text-[#8D9399] mb-3">카테고리</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowMore(false); }}
              className={`shrink-0 px-4 h-[32px] rounded-full text-[14px] font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#25B9B9] text-white'
                  : 'bg-[#F5F6F7] text-[#555B61] hover:bg-[#ECEFF2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="bg-white mt-2 px-4 py-16 text-center text-[#8D9399] text-[14px]">
          해당 카테고리의 이슈가 없습니다.
        </section>
      ) : (
        <>
          {/* Section 4: 정렬 토글 + 랭킹 리스트 */}
          <section className="bg-white mt-2 px-4 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-medium text-[#8D9399]">
                TOP {filtered.length} 랭킹
              </p>
            </div>

            {/* 정렬 탭 — Mint round-tab pattern */}
            <div className="flex gap-1 bg-[#F5F6F7] rounded-full p-1 mb-3 h-[40px]">
              <button
                onClick={() => { setSortMode('press'); setShowMore(false); }}
                className={`flex-1 rounded-full text-[14px] font-medium transition-colors ${
                  sortMode === 'press'
                    ? 'bg-white text-[#161B30] shadow-[0_1px_2px_rgba(17,17,17,0.04),0_2px_8px_rgba(17,17,17,0.06)]'
                    : 'text-[#B1B6BC]'
                }`}
              >
                기사 수 순
              </button>
              <button
                onClick={() => { setSortMode('benefit'); setShowMore(false); }}
                className={`flex-1 rounded-full text-[14px] font-medium transition-colors flex items-center justify-center gap-1 ${
                  sortMode === 'benefit'
                    ? 'bg-white text-[#161B30] shadow-[0_1px_2px_rgba(17,17,17,0.04),0_2px_8px_rgba(17,17,17,0.06)]'
                    : 'text-[#B1B6BC]'
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
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E9F8F8] text-[#25B9B9] text-[12px] font-bold cursor-pointer hover:bg-[#A8E3E3]"
                  >
                    ?
                  </span>
                )}
              </button>
            </div>

            {/* 영향도 등급 툴팁 */}
            {sortMode === 'benefit' && showGradeInfo && (
              <div className="mb-3 bg-[#E9F8F8] rounded-[12px] p-4">
                <p className="text-[15px] font-bold text-[#20A6A6] mb-2">영향도 등급이 뭐예요?</p>
                <p className="text-[14px] text-[#20A6A6] leading-[1.6] mb-3">
                  5개 페르소나(1인 가구·신혼부부·취업준비생·대학생·직장인) 각각에 대해 기사를 분석해,
                  얼마나 유리한지 판단해요. 점수가 높을수록 더 많은 청년에게 좋은 정책이에요.
                </p>
                <div className="space-y-1">
                  {IMPACT_GRADES.map((g) => (
                    <div key={g.impact} className="flex items-start gap-2 text-[14px]">
                      <span className="shrink-0 w-14 font-bold text-[#20A6A6]">{g.label}</span>
                      <span className="shrink-0 w-8 font-mono text-[#25B9B9]">{g.score}</span>
                      <span className="text-[#555B61]">{g.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOP 3 */}
            {featured.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {featured.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} featured />
                ))}
              </div>
            )}
            {/* 4~5위 */}
            {visibleRest.length > 0 && (
              <div className="divide-y divide-[#ECEFF2]">
                {visibleRest.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
            {/* 6위~ */}
            {hiddenRest.length > 0 && (
              <>
                {showMore && (
                  <div className="divide-y divide-[#ECEFF2]">
                    {hiddenRest.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowMore((v) => !v)}
                  className="w-full mt-3 h-[44px] rounded-[8px] bg-white border border-[#E2E6EB] text-[15px] font-medium text-[#161B30] hover:bg-[#F5F6F7] transition-colors"
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
