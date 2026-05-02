'use client';

import { useEffect } from 'react';
import { SourceArticle } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  sources: SourceArticle[];
}

export default function SourceSheet({ open, onClose, sources }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-t-[16px] pt-7 px-6 pb-8 max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="w-9 h-1 bg-[#E2E6EB] rounded-full mx-auto -mt-3 mb-4" />

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#161B30]">출처 확인</h3>
            <p className="text-[14px] text-[#8D9399] mt-1 leading-[1.6]">
              총 {sources.length}곳의 언론사 보도를 기반으로 작성되었습니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8D9399] hover:text-[#161B30] text-[22px] leading-none shrink-0 w-9 h-9 flex items-center justify-center"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          <ul className="divide-y divide-[#ECEFF2]">
            {sources.map((src, i) => (
              <li key={i}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 py-3 px-2 -mx-2 rounded-[8px] hover:bg-[#F5F6F7] transition-colors"
                >
                  <span className="flex items-center justify-center shrink-0 w-6 h-6 bg-[#E9F8F8] text-[#25B9B9] text-[13px] font-bold rounded-full">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-[#25B9B9] mb-0.5">{src.press}</p>
                    <p className="text-[14px] text-[#161B30] font-medium leading-[1.6] line-clamp-2">
                      {src.title}
                    </p>
                  </div>
                  <span className="text-[#B1B6BC] text-[14px] shrink-0 mt-1">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[12px] text-[#B1B6BC] mt-4 leading-[1.6] text-center">
          📌 출처 클릭 시 네이버 뉴스 검색으로 이동합니다
        </p>
      </div>
    </div>
  );
}
