'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { issues } from '@/data/issues';
import { getCategoryColor, getImpactColor, getImpactIcon, getImpactLabel } from '@/lib/utils';
import { toggleSaved, isSaved } from '@/lib/store';

export default function IssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const issue = issues.find((i) => i.id === id);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) setSaved(isSaved(id));
  }, [id]);

  if (!issue) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">
        이슈를 찾을 수 없습니다.
        <br />
        <Link href="/" className="text-indigo-500 underline mt-4 inline-block">홈으로</Link>
      </div>
    );
  }

  const handleSave = () => {
    const next = toggleSaved(issue.id);
    setSaved(next);
  };

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-28">
      {/* 상단 네비 */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 px-4 h-12 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1">
          ← 뒤로
        </button>
        <button
          onClick={handleSave}
          className={`text-sm font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            saved
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {saved ? '🔖 저장됨' : '+ 내 혜택함 저장'}
        </button>
      </div>

      <div className="px-4 pt-5">
        {/* 헤더 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
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
            <span className="text-xs bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-medium">AI 요약</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
            {issue.summary.map((line, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-indigo-400 font-black text-sm shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 px-1">
            ⚠️ AI 분석은 실제 공고와 다를 수 있으니 반드시 원문을 확인하세요.
          </p>
        </section>

        {/* 2. 영향도 대시보드 */}
        <section className="mb-6">
          <p className="text-sm font-black text-gray-800 mb-3">나에게도 좋을까요?</p>
          <div className="space-y-2.5">
            {issue.personaImpacts.map((pi) => (
              <div key={pi.persona} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-lg shrink-0">{getImpactIcon(pi.impact)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
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

        {/* 5. 출처 */}
        <section className="mb-8">
          <p className="text-sm font-black text-gray-800 mb-3">출처 확인</p>
          <div className="space-y-2">
            {issue.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-500 transition-colors"
              >
                <span className="text-gray-300">📰</span>
                <span className="font-medium text-gray-400">[{src.press}]</span>
                <span className="underline underline-offset-2">{src.title}</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* 하단 CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-md mx-auto">
        <a
          href={issue.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-4 rounded-2xl text-sm transition-colors shadow-lg shadow-indigo-200"
        >
          {issue.applyLabel} →
        </a>
      </div>
    </main>
  );
}
