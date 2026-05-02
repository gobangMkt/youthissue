'use client';

import { useEffect, useState } from 'react';

const messages = [
  '어제 발표된 청약 조건 보셨나요? 거주 지역이라 혜택 가능성이 있어요! 👀',
  '오늘 자정이 지나면 마감되는 혜택이 있어요. \'월세 지원\' 잊지 마세요 📌',
  '금리 올랐다는 뉴스에 걱정되셨죠? 다행히 청년 전용 대출 금리는 유지된대요 😮‍💨',
];

export default function PushBanner() {
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState(messages[0]);

  useEffect(() => {
    setMsg(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-[#E9F8F8] rounded-[12px] px-4 py-[14px] flex items-start gap-3">
      <span className="text-xl shrink-0">🔔</span>
      <p className="text-[14px] text-[#555B61] leading-[1.6] flex-1">{msg}</p>
      <button
        onClick={() => setVisible(false)}
        className="text-[#8D9399] hover:text-[#161B30] shrink-0 text-lg leading-none"
        aria-label="알림 닫기"
      >
        ×
      </button>
    </div>
  );
}
