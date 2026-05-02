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
    <main className="max-w-[480px] mx-auto bg-white min-h-screen pb-20">
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-[20px] font-bold text-[#161B30] mb-0.5">내 혜택함</h1>
        <p className="text-[14px] text-[#8D9399]">저장한 이슈를 모아서 확인하세요</p>
      </div>

      {savedIssues.length === 0 ? (
        <div className="text-center py-24 px-8">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-[16px] font-bold text-[#555B61] mb-2">아직 저장한 이슈가 없어요</p>
          <p className="text-[14px] text-[#8D9399] mb-6">이슈 상세 페이지에서 &quot;내 혜택함 저장&quot;을 눌러보세요.</p>
          <Link
            href="/"
            className="inline-block bg-[#25B9B9] text-white text-[15px] font-medium px-6 py-3 rounded-[8px] hover:bg-[#20A6A6] transition-colors"
          >
            오늘의 이슈 보러가기
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {savedIssues.map((issue) => (
            <div
              key={issue.id}
              className="border border-[#E2E6EB] rounded-[12px] p-4 hover:border-[#25B9B9] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-medium px-1.5 py-[2px] rounded-[4px] ${getCategoryColor(issue.category)}`}>
                    {issue.category}
                  </span>
                  <span className="text-[13px] text-[#8D9399]">TOP {issue.rank}</span>
                </div>
                <button
                  onClick={() => handleRemove(issue.id)}
                  className="text-[13px] text-[#B1B6BC] hover:text-[#FF513E] transition-colors"
                >
                  삭제
                </button>
              </div>
              <Link href={`/issue/${issue.id}`}>
                <p className="text-[16px] font-bold text-[#161B30] leading-[1.5] mb-2 hover:text-[#25B9B9] transition-colors">
                  {issue.title}
                </p>
              </Link>
              <p className="text-[14px] text-[#555B61] leading-[1.6] line-clamp-2">{issue.summary[0]}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {issue.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[13px] text-[#8D9399]">{tag}</span>
                  ))}
                </div>
                <a
                  href={issue.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-medium text-[#25B9B9] hover:text-[#20A6A6]"
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
