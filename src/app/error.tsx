"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi ứng dụng:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi không mong muốn</h2>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
        {error.message || "Hệ thống gặp sự cố trong quá trình xử lý. Bạn có thể thử tải lại trang hoặc quay lại trang chủ."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Thử lại
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
        >
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
