'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { issues } from '@/data/issues';
import { Issue } from '@/types';
import { getSavedIds, toggleSaved } from '@/lib/store';
import { getCategoryColor } from '@/lib/utils';

export default function SavedPage() {
  const [savedIssues, setSavedIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const ids = getSavedIds();
    setSavedIssues(issues.filter((i) => ids.includes(i.id)));
  }, []);

  const handleRemove = (id: string) => {
    toggleSaved(id);
    setSavedIssues((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-20">
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-xl font-black text-gray-900 mb-0.5">내 혜택함</h1>
        <p className="text-xs text-gray-400">저장한 이슈를 모아서 확인하세요</p>
      </div>

      {savedIssues.length === 0 ? (
        <div className="text-center py-24 px-8">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-base font-bold text-gray-600 mb-2">아직 저장한 이슈가 없어요</p>
          <p className="text-sm text-gray-400 mb-6">이슈 상세 페이지에서 "내 혜택함 저장"을 눌러보세요.</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors"
          >
            오늘의 이슈 보러가기
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {savedIssues.map((issue) => (
            <div
              key={issue.id}
              className="border border-gray-100 rounded-2xl p-4 hover:border-indigo-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(issue.category)}`}>
                    {issue.category}
                  </span>
                  <span className="text-xs text-gray-400">TOP {issue.rank}</span>
                </div>
                <button
                  onClick={() => handleRemove(issue.id)}
                  className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                >
                  삭제
                </button>
              </div>
              <Link href={`/issue/${issue.id}`}>
                <p className="text-sm font-bold text-gray-900 leading-snug mb-2 hover:text-indigo-600 transition-colors">
                  {issue.title}
                </p>
              </Link>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{issue.summary[0]}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {issue.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-gray-400">{tag}</span>
                  ))}
                </div>
                <a
                  href={issue.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-500 hover:text-indigo-700"
                >
                  신청하기 →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
