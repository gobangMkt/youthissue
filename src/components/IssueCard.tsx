'use client';

import Link from 'next/link';
import { Issue } from '@/types';
import { getCategoryColor, getRankChangeDisplay } from '@/lib/utils';

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
export default function IssueCard({ issue, featured = false }: Props) {
  const { text: changeText, color: changeColor } = getRankChangeDisplay(issue.rankChange);
  const pressCount = issue.sources.length;

  if (featured) {
    return (
      <Link href={`/issue/${issue.id}`} className="block">
        <div className="flex items-center gap-3 py-3 px-3 -mx-3 rounded-[10px] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
          {/* 랭크 숫자 — 테일 컬러 포인트 */}
          <div className="w-7 text-center shrink-0">
            <span className="text-[20px] font-bold text-[#00B2C0] leading-none">
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
              <span className={`text-[11px] font-semibold ${changeColor}`}>
                {changeText}
              </span>
            </div>
            <p className="text-[15px] font-bold text-[#191F28] leading-[1.35] line-clamp-2">
              {issue.title}
            </p>
            <p className="text-[11px] text-[#8B95A1] mt-1">
              {pressCount}개 언론사 · {issue.updatedAt.split(' ')[0]}
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
            <span className={`text-[11px] font-semibold ${changeColor}`}>
              {changeText}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[#191F28] leading-[1.4] line-clamp-2">
            {issue.title}
          </p>
          <p className="text-[11px] text-[#8B95A1] mt-1">
            {pressCount}개 언론사 · {issue.updatedAt.split(' ')[0]}
          </p>
        </div>
      </div>
    </Link>
  );
}
