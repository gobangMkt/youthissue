'use client';

import { useState } from 'react';
import IssueCard from '@/components/IssueCard';
import PushBanner from '@/components/PushBanner';
import { issues } from '@/data/issues';
import { Category } from '@/types';

const CATEGORIES: (Category | '전체')[] = ['전체', '주거', '금융', '취업', '복지', '교육'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | '전체'>('전체');

  const filtered =
    activeCategory === '전체' ? issues : issues.filter((i) => i.category === activeCategory);

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-20">
      {/* Hero */}
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-xl font-black text-gray-900 mb-0.5">오늘의 청년이슈 TOP 10</h1>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })} 00:00 기준 · 매일 자정 갱신
        </p>
      </div>

      {/* Push Banner */}
      <PushBanner />

      {/* Category Filter */}
      <div className="flex gap-2 px-4 mb-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">해당 카테고리의 이슈가 없습니다.</div>
      ) : (
        <>
          {/* Featured Cards */}
          {featured.length > 0 && (
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">오늘의 TOP 3</p>
              <div className="flex flex-col gap-3">
                {featured.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} featured />
                ))}
              </div>
            </div>
          )}

          {/* Ranking List */}
          {rest.length > 0 && (
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">전체 랭킹</p>
              <div className="divide-y divide-gray-100">
                {rest.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
