'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-indigo-600 tracking-tight">청년이슈 픽</span>
          <span className="text-xs bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-medium">PICK</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            홈
          </Link>
          <Link
            href="/saved"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              pathname === '/saved' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            내 혜택함
          </Link>
        </nav>
      </div>
    </header>
  );
}
