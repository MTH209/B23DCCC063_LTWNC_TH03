import Link from "next/link";
import { ShieldX, Home, LayoutDashboard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Quyền truy cập bị từ chối | Class Deadline Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <span className="text-8xl font-black text-rose-100 tracking-widest select-none">
          403
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <ShieldX className="w-8 h-8" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-2">
        Truy cập bị từ chối (403 Forbidden)
      </h1>
      <p className="text-xs text-slate-600 max-w-md mb-8 leading-relaxed font-medium">
        Trang này chỉ dành riêng cho <strong>Lớp trưởng (Admin)</strong>. Tài khoản sinh viên hiện tại của bạn không có đủ thẩm quyền để quản trị deadline của lớp.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          Về Dashboard cá nhân
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Về Trang chủ
        </Link>
      </div>
    </div>
  );
}
