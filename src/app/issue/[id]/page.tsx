'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { issues } from '@/data/issues';
import SourceSheet from '@/components/SourceSheet';
import {
  getCategoryColor,
  getImpactColor,
  getImpactIcon,
  getImpactLabel,
} from '@/lib/utils';

// 영향도 판단 기준 (4대 축)
const CRITERIA_INFO = [
  { label: '🎂 나이', value: '만 19세 ~ 39세 (정책별 상이)' },
  { label: '💰 소득', value: '기준 중위소득 대비 % (60·80·100·120·140%)' },
  { label: '🏠 자산', value: '총자산 및 자동차 가액 기준 (2.5억~3.45억)' },
  { label: '💍 혼인', value: '미혼 / 예비신혼 / 신혼(7년 이내) / 자녀 유무' },
];

const PERSONAS_DESC: Record<string, string> = {
  '1인 가구': '독신 청년 세입자 · 소득 하위권 중심',
  '신혼부부': '혼인 7년 이내 · 자녀 유무 포함',
  '취업준비생': '무소득·구직급여 수급 중인 청년',
  '대학생': '재학 중·아르바이트 수준 소득',
  '직장인': '중위소득 100~140% 재직 청년',
};

/**
 * 고방 디자인 시스템 적용:
 * - 회색 페이지 배경 + 흰색 섹션 카드 (8px 갭)
 * - 테일 primary (#00B2C0)
 * - 출처는 본문 내 작은 인라인 칩으로 축소 (토스피드 스타일)
 * - Bottom Fixed CTA: 10px radius 테일 버튼
 */
export default function IssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const issue = issues.find((i) => i.id === id);
  const [showCriteria, setShowCriteria] = useState(false);
  const [showSources, setShowSources] = useState(false);

  if (!issue) {
    return (
      <main className="max-w-[480px] mx-auto min-h-screen">
        <section className="bg-white px-5 py-20 text-center text-[#8B95A1] text-[14px]">
          이슈를 찾을 수 없습니다.
          <br />
          <Link href="/" className="text-[#00B2C0] font-semibold mt-4 inline-block">
            홈으로
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-[480px] mx-auto min-h-screen pb-[110px]">
      {/* Section 0: 상단 뒤로가기 */}
      <div className="sticky top-14 z-40 bg-white border-b border-[#F2F4F6] px-5 h-12 flex items-center">
        <button
          onClick={() => router.back()}
          className="text-[#4E5968] hover:text-[#191F28] text-[14px] font-semibold flex items-center gap-1"
        >
          ← 뒤로
        </button>
      </div>

      {/* Section 1: 헤더 (제목/카테고리/태그) */}
      <section className="bg-white px-5 pt-5 pb-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-[11px] font-bold px-2 py-[2px] rounded-[6px] ${getCategoryColor(
              issue.category
            )}`}
          >
            {issue.category}
          </span>
          <span className="text-[12px] text-[#8B95A1]">언론사 {issue.sources.length}곳 보도</span>
          <span className="text-[12px] text-[#B0B8C1]">·</span>
          <span className="text-[12px] text-[#8B95A1]">{issue.updatedAt} 기준</span>
        </div>
        <h1 className="text-[20px] font-bold text-[#191F28] leading-[1.35]">{issue.title}</h1>
        {issue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {issue.tags.map((tag) => (
              <span key={tag} className="text-[12px] text-[#8B95A1]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: 3줄 요약 */}
      <section className="bg-white mt-2 px-5 pt-5 pb-5">
        <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px] mb-3">
          어떤 일이 일어났나요?
        </p>
        <div className="bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[10px] p-4 space-y-2.5">
          {issue.summary.map((line, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="text-[#00B2C0] font-bold text-[14px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-[14px] text-[#4A5568] leading-[1.6]">{line}</p>
            </div>
          ))}
        </div>
        {/* 출처 버튼 (토스 스타일 — 누르면 바텀시트) */}
        {issue.sources.length > 0 && (
          <button
            onClick={() => setShowSources(true)}
            className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-[#4E5968] hover:text-[#00B2C0] bg-[#F2F4F6] hover:bg-[#E0F8FA] px-3 py-2 rounded-[8px] transition-colors"
          >
            <span>📰</span>
            <span>출처 {issue.sources.length}곳 보기</span>
            <span className="text-[#B0B8C1]">→</span>
          </button>
        )}
      </section>

      {/* Section 3: 영향도 대시보드 */}
      <section className="bg-white mt-2 px-5 pt-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px]">
            나에게도 좋을까요?
          </p>
          <button
            onClick={() => setShowCriteria((v) => !v)}
            className="text-[12px] text-[#00B2C0] hover:text-[#009AAA] font-semibold"
          >
            {showCriteria ? '기준 닫기 ▲' : '판단 기준 ▼'}
          </button>
        </div>

        {/* 기준 공개 패널 */}
        {showCriteria && (
          <div className="mb-3 bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[10px] p-4">
            <p className="text-[13px] font-bold text-[#1A7A85] mb-2">
              📐 영향도 판단 기준 (4대 축)
            </p>
            <div className="space-y-1.5 mb-3">
              {CRITERIA_INFO.map((c) => (
                <div key={c.label} className="flex items-start gap-2">
                  <span className="text-[12px] font-semibold text-[#1A7A85] shrink-0 w-[72px]">
                    {c.label}
                  </span>
                  <span className="text-[12px] text-[#4A5568]">{c.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] font-bold text-[#1A7A85] mb-1.5">👥 분석 대상 페르소나</p>
            <div className="space-y-1">
              {Object.entries(PERSONAS_DESC).map(([persona, desc]) => (
                <div key={persona} className="flex items-start gap-2">
                  <span className="text-[12px] font-semibold text-[#1A7A85] shrink-0 w-[72px]">
                    {persona}
                  </span>
                  <span className="text-[12px] text-[#4A5568]">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#8B95A1] mt-2.5 leading-[1.6]">
              기사 본문에서 소득·자산 수치를 추출하여 각 페르소나와 대조 후 유불리를 추론합니다.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {issue.personaImpacts.map((pi) => (
            <div
              key={pi.persona}
              className="flex items-start gap-3 bg-[#F2F4F6] rounded-[10px] p-3"
            >
              <span className="text-[18px] shrink-0">{getImpactIcon(pi.impact)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[13px] font-bold text-[#191F28]">{pi.persona}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-[2px] rounded-[6px] ${getImpactColor(
                      pi.impact
                    )}`}
                  >
                    {getImpactLabel(pi.impact)}
                  </span>
                </div>
                <p className="text-[12px] text-[#4A5568] leading-[1.6]">{pi.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: 체크포인트 */}
      {issue.checkpoints.length > 0 && (
        <section className="bg-white mt-2 px-5 pt-5 pb-5">
          <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px] mb-3">
            체크할 포인트
          </p>
          <div className="border-[1.5px] border-[#E5E8EB] rounded-[10px] overflow-hidden">
            {issue.checkpoints.map((cp, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== issue.checkpoints.length - 1 ? 'border-b border-[#F2F4F6]' : ''
                }`}
              >
                <span className="text-[13px] text-[#8B95A1] font-medium">{cp.label}</span>
                <span className="text-[13px] font-bold text-[#191F28] text-right ml-4 max-w-[55%]">
                  {cp.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 5: 연관 혜택 */}
      {issue.relatedBenefits.length > 0 && (
        <section className="bg-white mt-2 px-5 pt-5 pb-5">
          <p className="text-[13px] font-semibold text-[#8B95A1] tracking-[0.3px] mb-3">
            연관된 혜택도 확인하세요
          </p>
          <div className="flex flex-col gap-2">
            {issue.relatedBenefits.map((benefit) => (
              <a
                key={benefit.id}
                href={benefit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-[1.5px] border-[#E5E8EB] hover:border-[#00B2C0] rounded-[10px] px-4 py-3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-[2px] rounded-[6px] ${getCategoryColor(
                      benefit.category
                    )}`}
                  >
                    {benefit.category}
                  </span>
                  <span className="text-[14px] font-semibold text-[#191F28]">{benefit.title}</span>
                </div>
                <span className="text-[#8B95A1] text-[14px]">→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA (고방 표준: 10px radius, 테일, 하단 고정) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[#F2F4F6] px-5 pt-3 pb-4">
        <a
          href={issue.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#00B2C0] hover:bg-[#009AAA] text-white text-center font-bold py-[15px] rounded-[10px] text-[16px] transition-colors"
        >
          {issue.applyLabel}
        </a>
      </div>

      {/* Source Bottom Sheet */}
      <SourceSheet
        open={showSources}
        onClose={() => setShowSources(false)}
        sources={issue.sources}
      />
    </main>
  );
}
