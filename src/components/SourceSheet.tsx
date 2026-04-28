'use client';

import { useEffect } from 'react';
import { SourceArticle } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  sources: SourceArticle[];
}

/**
 * 토스 스타일 바텀시트 — 전체 출처 리스트
 * - overlay 클릭 시 닫힘
 * - slideUp 애니메이션
 * - ESC 키 지원
 */
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
        className="w-full max-w-[480px] bg-white rounded-t-[20px] pt-7 px-6 pb-8 max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="w-9 h-1 bg-[#E5E8EB] rounded-full mx-auto -mt-3 mb-4" />

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[20px] font-bold text-[#191F28]">출처 확인</h3>
            <p className="text-[15px] text-[#8B95A1] mt-1 leading-[1.5]">
              총 {sources.length}곳의 언론사 보도를 기반으로 작성되었습니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B95A1] hover:text-[#191F28] text-[22px] leading-none shrink-0 w-9 h-9 flex items-center justify-center"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          <ul className="divide-y divide-[#F2F4F6]">
            {sources.map((src, i) => (
              <li key={i}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 py-3 px-2 -mx-2 rounded-[10px] hover:bg-[#F2F4F6] transition-colors"
                >
                  <span className="flex items-center justify-center shrink-0 w-6 h-6 bg-[#E0F8FA] text-[#00B2C0] text-[13px] font-bold rounded-full">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-[#00B2C0] mb-0.5">{src.press}</p>
                    <p className="text-[14px] text-[#191F28] font-semibold leading-[1.45] line-clamp-2">
                      {src.title}
                    </p>
                  </div>
                  <span className="text-[#B0B8C1] text-[14px] shrink-0 mt-1">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 안내 */}
        <p className="text-[13px] text-[#B0B8C1] mt-4 leading-[1.6] text-center">
          📌 출처 클릭 시 네이버 뉴스 검색으로 이동합니다
        </p>
      </div>
    </div>
  );
}
