'use client';

import { useState } from 'react';
import IssueCard from '@/components/IssueCard';
import PushBanner from '@/components/PushBanner';
import { issues } from '@/data/issues';
import { Category } from '@/types';

const CATEGORIES: (Category | '전체')[] = ['전체', '주거', '금융', '취업', '복지', '교육'];

const RANKING_CRITERIA_LINES = [
  '지난 7일 동안 나온 청년 정책 기사를 전부 모았어요.',
  '같은 내용을 다룬 기사끼리 하나의 이슈로 묶었어요.',
  '그리고 더 많은 언론사가 다룬 이슈일수록 위로 올려요.',
  '',
  '즉, 여기 TOP에 올라온 이슈는 이번 주 가장 많이 회자된 청년 이슈라고 보시면 돼요.',
];

/**
 * 고방 디자인 시스템:
 * - 회색 페이지 배경 (#F2F4F6)
 * - 흰색 섹션 카드들이 8px 갭으로 쌓임 (좌우 풀-위드)
 */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | '전체'>('전체');
  const [showCriteria, setShowCriteria] = useState(false);

  const filtered =
    activeCategory === '전체' ? issues : issues.filter((i) => i.category === activeCategory);

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <main className="max-w-[480px] mx-auto min-h-screen pb-8">
      {/* Section 1: Hero */}
      <section className="bg-white px-5 pt-5 pb-5">
        <h1 className="text-[20px] font-bold text-[#191F28] mb-1">오늘의 청년이슈 TOP 10</h1>
        <p className="text-[13px] text-[#8B95A1]">
          매주 월요일 09:00 갱신 · 지난 7일 기사 분석
        </p>
      </section>

      {/* Section 2: Push Banner */}
      <section className="bg-white mt-2 px-5 py-4">
        <PushBanner />
      </section>

      {/* Section 3: Category Filter */}
      <section className="bg-white mt-2 px-5 py-4">
        <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px] mb-3">카테고리</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
          {/* Section 4: 랭킹 리스트 (언론사 보도량 기준) */}
          <section className="bg-white mt-2 px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px]">
                TOP {filtered.length} 랭킹
              </p>
              <button
                onClick={() => setShowCriteria((v) => !v)}
                className="text-[12px] text-[#00B2C0] hover:text-[#009AAA] font-semibold"
              >
                {showCriteria ? '닫기 ▲' : 'TOP은 어떻게 정해지나요? ▼'}
              </button>
            </div>

            {/* 선정 기준 패널 — 토스 톤 */}
            {showCriteria && (
              <div className="mb-3 bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[10px] p-4">
                <p className="text-[13px] font-bold text-[#1A7A85] mb-2">
                  TOP은 이렇게 정해져요
                </p>
                <div className="space-y-1.5">
                  {RANKING_CRITERIA_LINES.map((line, i) =>
                    line === '' ? (
                      <div key={i} className="h-1" />
                    ) : (
                      <p key={i} className="text-[13px] text-[#1A7A85] leading-[1.6]">
                        {line}
                      </p>
                    )
                  )}
                </div>
                <p className="text-[11px] text-[#8B95A1] mt-3 pt-3 border-t border-[#A8E6EC]">
                  매주 월요일 오전에 새로 갱신돼요.
                </p>
              </div>
            )}

            <div className="divide-y divide-[#F2F4F6]">
              {featured.map((issue) => (
                <IssueCard key={issue.id} issue={issue} featured />
              ))}
              {rest.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
