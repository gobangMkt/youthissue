'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { issues } from '@/data/issues';
import { getCategoryColor, getImpactColor, getImpactIcon, getImpactLabel } from '@/lib/utils';

// 영향도 판단 기준 (4대 축)
const CRITERIA_INFO = [
  { label: '🎂 나이', value: '만 19세 ~ 39세 (정책별 상이)' },
  { label: '💰 소득', value: '기준 중위소득 대비 % (60·80·100·120·140%)' },
  { label: '🏠 자산', value: '총자산 및 자동차 가액 기준 (2.5억~3.45억)' },
  { label: '💍 혼인', value: '미혼 / 예비신혼 / 신혼(7년 이내) / 자녀 유무' },
];

const PERSONAS_DESC: Record<string, string> = {
  '1인 가구':   '독신 청년 세입자 · 소득 하위권 중심',
  '신혼부부':   '혼인 7년 이내 · 자녀 유무 포함',
  '취업준비생': '무소득·구직급여 수급 중인 청년',
  '대학생':     '재학 중·아르바이트 수준 소득',
  '직장인':     '중위소득 100~140% 재직 청년',
};

export default function IssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const issue = issues.find((i) => i.id === id);
  const [showCriteria, setShowCriteria] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">
        이슈를 찾을 수 없습니다.
        <br />
        <Link href="/" className="text-indigo-500 underline mt-4 inline-block">홈으로</Link>
      </div>
    );
  }

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-28">
      {/* 상단 네비 */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 px-4 h-12 flex items-center">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1">
          ← 뒤로
        </button>
      </div>

      <div className="px-4 pt-5">
        {/* 헤더 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(issue.category)}`}>
              {issue.category}
            </span>
            <span className="text-xs text-gray-400">언론사 {issue.pressCount}곳 보도 중</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{issue.updatedAt} 기준</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 leading-snug">{issue.title}</h1>
          <div className="flex flex-wrap gap-1 mt-2">
            {issue.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-400">{tag}</span>
            ))}
          </div>
        </div>

        {/* 1. AI 3줄 요약 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-black text-gray-800">어떤 일이 일어났나요?</span>
            {/* LLM 정보 배지 */}
            <span
              className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-1.5 py-0.5 rounded font-medium cursor-default"
              title="GPT-4o API를 통해 뉴스 클러스터를 분석하고 3줄 요약 및 체크포인트를 생성합니다."
            >
              GPT-4o
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
            {issue.summary.map((line, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-indigo-400 font-black text-sm shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
          {/* LLM 상세 설명 */}
          <div className="mt-2 px-1 flex items-start gap-1.5">
            <span className="text-xs text-gray-400 leading-relaxed">
              🤖 <strong className="text-gray-500">GPT-4o</strong>가 수집된 언론 기사를 분석해 요약합니다.
              RAG(검색 증강 생성)로 공공 API 공고 원문을 참조해 수치 왜곡을 방지합니다.
            </span>
          </div>
          <p className="text-xs text-red-400 mt-1.5 px-1">
            ⚠️ AI 분석은 실제 공고와 다를 수 있으니 반드시 원문을 확인하세요.
          </p>
        </section>

        {/* 2. 영향도 대시보드 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-black text-gray-800">나에게도 좋을까요?</p>
            <button
              onClick={() => setShowCriteria((v) => !v)}
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              {showCriteria ? '기준 닫기 ▲' : '판단 기준 보기 ▼'}
            </button>
          </div>

          {/* 기준 공개 패널 */}
          {showCriteria && (
            <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-700 mb-2">📐 AI 영향도 판단 기준 (4대 축)</p>
              <div className="space-y-1.5 mb-3">
                {CRITERIA_INFO.map((c) => (
                  <div key={c.label} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-indigo-600 shrink-0 w-20">{c.label}</span>
                    <span className="text-xs text-indigo-800">{c.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-indigo-700 mb-1.5">👥 분석 대상 페르소나</p>
              <div className="space-y-1">
                {Object.entries(PERSONAS_DESC).map(([persona, desc]) => (
                  <div key={persona} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-indigo-600 shrink-0 w-20">{persona}</span>
                    <span className="text-xs text-indigo-800">{desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-indigo-500 mt-2.5">
                GPT-4o가 기사 본문에서 소득·자산 수치를 추출하여 각 페르소나와 대조 후 유불리를 추론합니다.
              </p>
            </div>
          )}

          <div className="space-y-2.5">
            {issue.personaImpacts.map((pi) => (
              <div key={pi.persona} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-lg shrink-0">{getImpactIcon(pi.impact)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-800">{pi.persona}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${getImpactColor(pi.impact)}`}>
                      {getImpactLabel(pi.impact)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{pi.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 체크포인트 */}
        <section className="mb-6">
          <p className="text-sm font-black text-gray-800 mb-3">체크할 포인트</p>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {issue.checkpoints.map((cp, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== issue.checkpoints.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-xs text-gray-500 font-medium">{cp.label}</span>
                <span className="text-xs font-bold text-gray-800 text-right ml-4 max-w-[55%]">{cp.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 연관 혜택 */}
        {issue.relatedBenefits.length > 0 && (
          <section className="mb-6">
            <p className="text-sm font-black text-gray-800 mb-3">연관된 혜택도 확인하세요</p>
            <div className="flex flex-col gap-2">
              {issue.relatedBenefits.map((benefit) => (
                <a
                  key={benefit.id}
                  href={benefit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(benefit.category)}`}>
                      {benefit.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{benefit.title}</span>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 5. 출처 확인 */}
        <section className="mb-8">
          <p className="text-sm font-black text-gray-800 mb-3">출처 확인</p>
          <div className="space-y-2.5">
            {issue.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2.5 transition-colors group"
              >
                <span className="text-base shrink-0 mt-0.5">📰</span>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-indigo-500 group-hover:text-indigo-700 block">
                    {src.press}
                  </span>
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 leading-snug line-clamp-2">
                    {src.title}
                  </span>
                </div>
                <span className="text-gray-300 text-xs shrink-0 mt-0.5 group-hover:text-indigo-400">↗</span>
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 px-1">
            📌 출처 클릭 시 네이버 뉴스 검색으로 이동합니다.
          </p>
        </section>
      </div>

      {/* 하단 CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-md mx-auto">
        <a
          href={issue.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-4 rounded-2xl text-sm transition-colors"
          style={{ boxShadow: 'var(--shadow-cta)' }}
        >
          {issue.applyLabel} →
        </a>
      </div>
    </main>
  );
}
