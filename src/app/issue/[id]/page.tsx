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

export default function IssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const issue = issues.find((i) => i.id === id);
  const [showCriteria, setShowCriteria] = useState(false);
  const [showSources, setShowSources] = useState(false);

  if (!issue) {
    return (
      <main className="max-w-[480px] mx-auto min-h-screen">
        <section className="bg-white px-4 py-20 text-center text-[#8D9399] text-[14px]">
          이슈를 찾을 수 없습니다.
          <br />
          <Link href="/" className="text-[#25B9B9] font-medium mt-4 inline-block">
            홈으로
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-[480px] mx-auto min-h-screen pb-8">
      {/* Section 0: 상단 뒤로가기 */}
      <div className="sticky top-14 z-40 bg-white border-b border-[#ECEFF2] px-4 h-12 flex items-center">
        <button
          onClick={() => router.back()}
          className="text-[#555B61] hover:text-[#161B30] text-[14px] font-medium flex items-center gap-1"
        >
          ← 뒤로
        </button>
      </div>

      {/* Section 1: 헤더 */}
      <section className="bg-white px-4 pt-5 pb-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-[12px] font-medium px-1.5 py-[2px] rounded-[4px] ${getCategoryColor(
              issue.category
            )}`}
          >
            {issue.category}
          </span>
          <span className="text-[13px] text-[#8D9399]">언론사 {issue.sources.length}곳 보도</span>
          <span className="text-[13px] text-[#B1B6BC]">·</span>
          <span className="text-[13px] text-[#8D9399]">{issue.updatedAt} 기준</span>
        </div>
        <h1 className="text-[20px] font-bold text-[#161B30] leading-[1.5]">{issue.title}</h1>
        {issue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {issue.tags.map((tag) => (
              <span key={tag} className="text-[13px] text-[#8D9399]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: 3줄 요약 */}
      <section className="bg-white mt-2 px-4 pt-5 pb-5">
        <p className="text-[14px] font-medium text-[#8D9399] mb-3">
          어떤 일이 일어났나요?
        </p>
        <div className="bg-[#E9F8F8] rounded-[12px] p-4 space-y-2.5">
          {issue.summary.map((line, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="text-[#25B9B9] font-bold text-[14px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-[14px] text-[#555B61] leading-[1.6]">{line}</p>
            </div>
          ))}
        </div>
        {issue.sources.length > 0 && (
          <button
            onClick={() => setShowSources(true)}
            className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-[#555B61] hover:text-[#25B9B9] bg-[#F5F6F7] hover:bg-[#E9F8F8] px-3 py-2 rounded-[8px] transition-colors"
          >
            <span>📰</span>
            <span>출처 {issue.sources.length}곳 보기</span>
            <span className="text-[#B1B6BC]">→</span>
          </button>
        )}
      </section>

      {/* Section 3: 체크포인트 */}
      {(() => {
        const validCheckpoints = issue.checkpoints.filter(
          (cp) =>
            !/명시되지 않음|제공되지 않음|판단할 수 없음|알 수 없음/.test(cp.value)
        );
        if (validCheckpoints.length === 0) return null;
        return (
          <section className="bg-white mt-2 px-4 pt-5 pb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-medium text-[#8D9399]">
                체크할 포인트
              </p>
              <p className="text-[12px] text-[#B1B6BC]">기사에 나온 실제 수치·조건</p>
            </div>
            <div className="border border-[#E2E6EB] rounded-[12px] overflow-hidden">
              {validCheckpoints.map((cp, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== validCheckpoints.length - 1 ? 'border-b border-[#ECEFF2]' : ''
                  }`}
                >
                  <span className="text-[15px] text-[#8D9399]">{cp.label}</span>
                  <span className="text-[15px] font-bold text-[#161B30] text-right ml-4 max-w-[55%]">
                    {cp.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Section 4: 영향도 대시보드 */}
      <section className="bg-white mt-2 px-4 pt-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-medium text-[#8D9399]">
            나에게도 좋을까요?
          </p>
          <button
            onClick={() => setShowCriteria((v) => !v)}
            className="text-[14px] text-[#25B9B9] hover:text-[#20A6A6] font-medium"
          >
            {showCriteria ? '기준 닫기 ▲' : '판단 기준 ▼'}
          </button>
        </div>

        {showCriteria && (
          <div className="mb-3 bg-[#E9F8F8] rounded-[12px] p-4">
            <p className="text-[15px] font-bold text-[#20A6A6] mb-2">
              📐 영향도 판단 기준 (4대 축)
            </p>
            <div className="space-y-1.5 mb-3">
              {CRITERIA_INFO.map((c) => (
                <div key={c.label} className="flex items-start gap-2">
                  <span className="text-[14px] font-medium text-[#20A6A6] shrink-0 w-[72px]">
                    {c.label}
                  </span>
                  <span className="text-[14px] text-[#555B61]">{c.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[15px] font-bold text-[#20A6A6] mb-1.5">👥 분석 대상 페르소나</p>
            <div className="space-y-1">
              {Object.entries(PERSONAS_DESC).map(([persona, desc]) => (
                <div key={persona} className="flex items-start gap-2">
                  <span className="text-[14px] font-medium text-[#20A6A6] shrink-0 w-[72px]">
                    {persona}
                  </span>
                  <span className="text-[14px] text-[#555B61]">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#8D9399] mt-2.5 leading-[1.6]">
              기사 본문에서 소득·자산 수치를 추출하여 각 페르소나와 대조 후 유불리를 추론합니다.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {issue.personaImpacts.map((pi) => (
            <div
              key={pi.persona}
              className="flex items-start gap-3 bg-[#F5F6F7] rounded-[12px] p-3"
            >
              <span className="text-[18px] shrink-0">{getImpactIcon(pi.impact)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[15px] font-bold text-[#161B30]">{pi.persona}</span>
                  <span
                    className={`text-[12px] font-medium px-1.5 py-[2px] rounded-[4px] ${getImpactColor(
                      pi.impact
                    )}`}
                  >
                    {getImpactLabel(pi.impact)}
                  </span>
                </div>
                <p className="text-[14px] text-[#555B61] leading-[1.6]">{pi.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: 연관 혜택 */}
      {issue.relatedBenefits.length > 0 && (
        <section className="bg-white mt-2 px-4 pt-5 pb-5">
          <p className="text-[14px] font-medium text-[#8D9399] mb-3">
            연관된 혜택도 확인하세요
          </p>
          <div className="flex flex-col gap-2">
            {issue.relatedBenefits.map((benefit) => (
              <a
                key={benefit.id}
                href={benefit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-[#E2E6EB] hover:border-[#25B9B9] rounded-[12px] px-4 py-3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[12px] font-medium px-1.5 py-[2px] rounded-[4px] ${getCategoryColor(
                      benefit.category
                    )}`}
                  >
                    {benefit.category}
                  </span>
                  <span className="text-[14px] font-medium text-[#161B30]">{benefit.title}</span>
                </div>
                <span className="text-[#8D9399] text-[14px]">→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <SourceSheet
        open={showSources}
        onClose={() => setShowSources(false)}
        sources={issue.sources}
      />
    </main>
  );
}
