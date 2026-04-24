'use client';

import Link from 'next/link';
import { Issue } from '@/types';
import { getCategoryColor, getRankChangeDisplay } from '@/lib/utils';

interface Props {
  issue: Issue;
  featured?: boolean;
}

export default function IssueCard({ issue, featured = false }: Props) {
  const { text: changeText, color: changeColor } = getRankChangeDisplay(issue.rankChange);

  if (featured) {
    return (
      <Link href={`/issue/${issue.id}`} className="block">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-5 text-white h-44 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-start justify-between">
            <span className="text-3xl font-black opacity-30">#{issue.rank}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/20`}>
              {issue.category}
            </span>
          </div>
          <div>
            <p className="font-bold text-base leading-snug mb-2">{issue.title}</p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span>언론사 {issue.pressCount}곳</span>
              <span>·</span>
              <span>{issue.updatedAt} 기준</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/issue/${issue.id}`} className="block">
      <div className="flex items-center gap-4 py-4 px-1 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
        <div className="w-8 text-center shrink-0">
          <span className="text-lg font-black text-gray-800">{issue.rank}</span>
          <p className={`text-xs font-semibold ${changeColor}`}>{changeText}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(issue.category)}`}>
              {issue.category}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{issue.title}</p>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {issue.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-gray-400">{tag}</span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">{issue.pressCount}개 언론</p>
        </div>
      </div>
    </Link>
  );
}
