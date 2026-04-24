import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "청년이슈 픽 | 오늘의 청년 정책 뉴스 TOP 10",
  description: "매일 자정, 청년에게 꼭 필요한 정책 뉴스를 AI가 3줄로 요약해 드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
