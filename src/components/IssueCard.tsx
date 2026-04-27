'use client';

import Link from 'next/link';
import { Issue } from '@/types';
import { getCategoryColor, getCategoryFeaturedBg, getRankChangeDisplay } from '@/lib/utils';

interface Props {
  issue: Issue;
  featured?: boolean;
}

/**
 * 고방 디자인 시스템 적용
 * - featured: 컴팩트한 강조 카드 (세로 영역 최소화)
 * - 기본: 심플한 리스트 아이템
 * - 카테고리 뱃지는 중립 회색으로 통일
 */
function RankChangeBadge({ issue }: { issue: Issue }) {
  if (issue.isNew) {
    return (
      <span className="inline-flex items-center px-1.5 py-[2px] rounded-[5px] bg-[#E8F9FF] text-[#00B2C0] text-[10px] font-bold leading-none">
        NEW
      </span>
    );
  }
  const { text, color } = getRankChangeDisplay(issue.rankChange);
  return <span className={`text-[11px] font-semibold ${color}`}>{text}</span>;
}

export default function IssueCard({ issue, featured = false }: Props) {
  const pressCount = issue.sources.length;

  if (featured) {
    return (
      <Link href={`/issue/${issue.id}`} className="block">
        <div className={`flex items-center gap-3 py-4 px-3 -mx-3 rounded-[10px] transition-colors cursor-pointer ${getCategoryFeaturedBg(issue.category)}`}>
          {/* 랭크 숫자 */}
          <div className="w-7 text-center shrink-0">
            <span className="text-[22px] font-black text-[#191F28] leading-none">
              {issue.rank}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`text-[11px] font-bold px-1.5 py-[2px] rounded-[6px] ${getCategoryColor(
                  issue.category
                )}`}
              >
                {issue.category}
              </span>
              <RankChangeBadge issue={issue} />
            </div>
            <p className="text-[15px] font-bold text-[#191F28] leading-[1.35] line-clamp-2">
              {issue.title}
            </p>
            <p className="text-[11px] text-[#1A7A85] font-semibold mt-1">
              언론사 {pressCount}곳 보도
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/issue/${issue.id}`} className="block">
      <div className="flex items-start gap-3 py-3 px-1 hover:bg-[#F2F4F6] rounded-[10px] transition-colors cursor-pointer">
        <div className="w-7 text-center shrink-0 pt-[2px]">
          <span className="text-[18px] font-bold text-[#8B95A1] leading-none">
            {issue.rank}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`text-[11px] font-bold px-1.5 py-[2px] rounded-[6px] ${getCategoryColor(
                issue.category
              )}`}
            >
              {issue.category}
            </span>
            <RankChangeBadge issue={issue} />
          </div>
          <p className="text-[14px] font-semibold text-[#191F28] leading-[1.4] line-clamp-2">
            {issue.title}
          </p>
          <p className="text-[11px] text-[#8B95A1] mt-1">
            언론사 {pressCount}곳 보도
          </p>
        </div>
      </div>
    </Link>
  );
}
