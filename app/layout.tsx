import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCSC 고등학생 온라인 해커톤",
  description:
    "온라인으로 가볍게 진행하고 상금과 SCSC 회장상, 무료 캠퍼스 투어까지 받아가세요!",
  metadataBase: new URL("https://scsc-hackathon.vercel.app/"),
  openGraph: {
    title: "SCSC 고등학생 온라인 해커톤",
    description:
      "온라인으로 가볍게 진행하고 상금과 SCSC 회장상, 무료 캠퍼스 투어까지 받아가세요!",
    url: "https://scsc-hackathon.vercel.app/",
    siteName: "SCSC Online Hackathon",
    images: [{ url: "/opengraph.jpg", width: 1200, height: 630, alt: "SCSC Hackathon" }],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전국 고등학생 SCSC 온라인 해커톤",
    description:
      "온라인으로 가볍게 진행하고 상금과 SCSC 회장상, 무료 캠퍼스 투어까지 받아가세요!",
    images: ["/opengraph.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
