'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import { getCategoryColor, getCategoryFeaturedBg, getRankChangeDisplay } from '@/lib/utils';

interface Props {
  issue: Issue;
  featured?: boolean;
}

function RankChangeBadge({ issue }: { issue: Issue }) {
  if (issue.isNew) {
    return (
      <span className="inline-flex items-center px-1.5 py-[2px] rounded-[4px] bg-[#E9F8F8] text-[#25B9B9] text-[12px] font-medium leading-none">
        NEW
      </span>
    );
  }
  const { text, color } = getRankChangeDisplay(issue.rankChange);
  return <span className={`text-[13px] font-medium ${color}`}>{text}</span>;
}

function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-white/30">
      <div className="w-4 h-4 border-2 border-[#25B9B9] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function IssueCard({ issue, featured = false }: Props) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pressCount = issue.sources.length;

  const handleClick = () => setIsNavigating(true);

  if (featured) {
    return (
      <Link
        href={`/issue/${issue.id}`}
        className="block transition-transform duration-100 active:scale-[0.97]"
        onClick={handleClick}
      >
        <div
          className={`relative flex items-center gap-3 py-4 px-3 -mx-3 rounded-[12px] transition-all duration-100 cursor-pointer ${getCategoryFeaturedBg(issue.category)} ${isNavigating ? 'opacity-60' : ''}`}
        >
          {isNavigating && <Spinner />}
          <div className="w-7 text-center shrink-0">
            <span className="text-[22px] font-bold text-[#161B30] leading-none">
              {issue.rank}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`text-[12px] font-medium px-1.5 py-[2px] rounded-[4px] ${getCategoryColor(
                  issue.category
                )}`}
              >
                {issue.category}
              </span>
              <RankChangeBadge issue={issue} />
            </div>
            <p className="text-[15px] font-bold text-[#161B30] leading-[1.6] line-clamp-2">
              {issue.title}
            </p>
            <p className="text-[13px] text-[#20A6A6] font-medium mt-1">
              언론사 {pressCount}곳 보도
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/issue/${issue.id}`}
      className="block transition-transform duration-100 active:scale-[0.98]"
      onClick={handleClick}
    >
      <div
        className={`relative flex items-start gap-3 py-3 px-1 hover:bg-[#F5F6F7] rounded-[12px] transition-colors cursor-pointer ${isNavigating ? 'opacity-60 bg-[#F5F6F7]' : ''}`}
      >
        {isNavigating && <Spinner />}
        <div className="w-7 text-center shrink-0 pt-[2px]">
          <span className="text-[18px] font-bold text-[#8D9399] leading-none">
            {issue.rank}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`text-[12px] font-medium px-1.5 py-[2px] rounded-[4px] ${getCategoryColor(
                issue.category
              )}`}
            >
              {issue.category}
            </span>
            <RankChangeBadge issue={issue} />
          </div>
          <p className="text-[14px] font-bold text-[#161B30] leading-[1.6] line-clamp-2">
            {issue.title}
          </p>
          <p className="text-[13px] text-[#8D9399] mt-1">
            언론사 {pressCount}곳 보도
          </p>
        </div>
      </div>
    </Link>
  );
}
