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
 * - featured: 테일 다크 배경의 강조 카드
 * - 기본: 회색 구분선 없이 심플한 리스트 아이템
 */
export default function IssueCard({ issue, featured = false }: Props) {
  const { text: changeText, color: changeColor } = getRankChangeDisplay(issue.rankChange);

  if (featured) {
    return (
      <Link href={`/issue/${issue.id}`} className="block">
        <div className="bg-[#1A7A85] rounded-[12px] p-5 text-white min-h-[160px] flex flex-col justify-between cursor-pointer transition-colors hover:bg-[#15656E]">
          <div className="flex items-start justify-between">
            <span className="text-[32px] font-bold opacity-25 leading-none">#{issue.rank}</span>
            <span className="text-[11px] font-bold bg-white/20 text-white px-2 py-[3px] rounded-[6px]">
              {issue.category}
            </span>
          </div>
          <div>
            <p className="font-bold text-[16px] leading-[1.4] mb-2">{issue.title}</p>
            <div className="flex items-center gap-2 text-[12px] text-white/70">
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
      <div className="flex items-center gap-4 py-3 px-1 hover:bg-[#F2F4F6] rounded-[10px] transition-colors cursor-pointer">
        <div className="w-8 text-center shrink-0">
          <span className="text-[18px] font-bold text-[#191F28]">{issue.rank}</span>
          <p className={`text-[11px] font-semibold ${changeColor}`}>{changeText}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold px-2 py-[2px] rounded-[6px] ${getCategoryColor(issue.category)}`}>
              {issue.category}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[#191F28] leading-snug truncate">
            {issue.title}
          </p>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {issue.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[11px] text-[#B0B8C1]">{tag}</span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-[#8B95A1]">{issue.pressCount}개 언론</p>
        </div>
      </div>
    </Link>
  );
}
