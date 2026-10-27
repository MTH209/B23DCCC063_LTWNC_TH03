import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Class Deadline Hub | Cổng Deadline Lớp D23CNPM - PTIT",
    template: "%s | Class Deadline Hub",
  },
  description:
    "Cổng thông tin và theo dõi deadline học tập dành cho sinh viên Học viện Công nghệ Bưu chính Viễn thông (PTIT). Xem lịch nộp bài, phân loại môn học và quản lý tiến độ.",
  keywords: [
    "deadline ptit",
    "class deadline hub",
    "d23cnpm",
    "lập trình web",
    "ptit hà đông",
    "học viện bưu chính viễn thông",
  ],
  authors: [{ name: "Lớp D23CNPM PTIT" }],
  openGraph: {
    title: "Class Deadline Hub | Cổng Deadline Lớp D23CNPM",
    description:
      "Theo dõi lịch nộp bài tập, đồ án, thi cử cập nhật liên tục cho sinh viên PTIT.",
    siteName: "Class Deadline Hub",
    locale: "vi_VN",
    type: "website",
  },
};

import { AuthProvider } from "@/components/AuthProvider";
import { CompletionsProvider } from "@/context/CompletionsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <CompletionsProvider>
            {children}
          </CompletionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
