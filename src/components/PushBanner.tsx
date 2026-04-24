'use client';

import { useState } from 'react';

const messages = [
  '어제 발표된 청약 조건 보셨나요? 거주 지역이라 혜택 가능성이 있어요! 👀',
  '오늘 자정이 지나면 마감되는 혜택이 있어요. \'월세 지원\' 잊지 마세요 📌',
  '금리 올랐다는 뉴스에 걱정되셨죠? 다행히 청년 전용 대출 금리는 유지된대요 😮‍💨',
];

export default function PushBanner() {
  const [visible, setVisible] = useState(true);
  const msg = messages[Math.floor(Math.random() * messages.length)];

  if (!visible) return null;

  return (
    <div className="mx-4 mb-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-xl shrink-0">🔔</span>
      <p className="text-sm text-indigo-800 leading-relaxed flex-1">{msg}</p>
      <button
        onClick={() => setVisible(false)}
        className="text-indigo-300 hover:text-indigo-500 shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
