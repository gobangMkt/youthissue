'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F2F4F6]">
      <div className="max-w-[480px] mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#00B2C0] tracking-tight">청년이슈 픽</span>
          <span className="text-[11px] font-bold bg-[#EDE9FF] text-[#7248F2] px-1.5 py-0.5 rounded-[6px]">
            BETA
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-[10px] text-[14px] font-semibold transition-colors ${
              pathname === '/'
                ? 'bg-[#E0F8FA] text-[#00B2C0]'
                : 'text-[#8B95A1] hover:text-[#191F28]'
            }`}
          >
            홈
          </Link>
        </nav>
      </div>
    </header>
  );
}
