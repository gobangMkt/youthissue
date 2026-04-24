'use client';

import { useState } from 'react';
import IssueCard from '@/components/IssueCard';
import PushBanner from '@/components/PushBanner';
import { issues } from '@/data/issues';
import { Category } from '@/types';

const CATEGORIES: (Category | '전체')[] = ['전체', '주거', '금융', '취업', '복지', '교육'];

/**
 * 고방 디자인 시스템:
 * - 회색 페이지 배경 (#F2F4F6)
 * - 흰색 섹션 카드들이 8px 갭으로 쌓임 (좌우 풀-위드)
 */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | '전체'>('전체');

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
          {/* Section 4: 랭킹 리스트 (TOP 3 + 나머지 통합, 토스 실시간 이슈 스타일) */}
          <section className="bg-white mt-2 px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px]">
                TOP {filtered.length} 랭킹
              </p>
              <p className="text-[11px] text-[#B0B8C1]">언론사 보도량 기준</p>
            </div>
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
