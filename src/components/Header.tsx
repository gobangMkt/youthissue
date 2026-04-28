'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F2F4F6]">
      <div className="max-w-[480px] mx-auto px-5 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#00B2C0] tracking-tight">
            청년이슈 픽
          </span>
          <span className="text-[13px] font-bold bg-[#EDE9FF] text-[#7248F2] px-1.5 py-0.5 rounded-[6px]">
            BETA
          </span>
        </Link>
      </div>
    </header>
  );
}
