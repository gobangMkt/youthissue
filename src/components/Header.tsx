'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#ECEFF2]">
      <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#25B9B9] tracking-tight">
            청년이슈 픽
          </span>
          <span className="text-[12px] font-medium bg-[#E5D9FE] text-[#7233F8] px-1.5 py-0.5 rounded-[4px]">
            BETA
          </span>
        </Link>
      </div>
    </header>
  );
}
