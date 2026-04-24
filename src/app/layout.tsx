import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "청년이슈 픽 | 매주 청년 정책 뉴스 TOP 10",
  description: "매주 월요일, 청년에게 꼭 필요한 정책 뉴스를 AI가 3줄로 요약해 드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-[#F2F4F6] text-[#191F28]">
        <Header />
        {children}
      </body>
    </html>
  );
}
