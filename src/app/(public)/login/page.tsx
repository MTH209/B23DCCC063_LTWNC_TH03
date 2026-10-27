import { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Suspense } from "react";
import { CalendarDays, ShieldCheck } from "lucide-react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Không được lập chỉ mục trang login (Yêu cầu E)
export const metadata: Metadata = {
  title: "Đăng nhập | Class Deadline Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Form */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/20">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Đăng nhập tài khoản</h1>
          <p className="text-xs text-slate-500 font-medium">
            Cổng quản lý deadline lớp D23CNPM - PTIT
          </p>
        </div>

        {/* Client Login Form */}
        <div className="glass-panel p-8 bg-white border border-slate-200 shadow-xl">
          <Suspense fallback={<div className="text-xs text-slate-500 text-center font-medium">Đang tải form...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Default Accounts Helper Guide */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white/80 text-xs text-slate-600 space-y-2.5 shadow-2xs">
          <div className="text-slate-800 font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Tài khoản mẫu theo đề bài
          </div>
          <div className="grid grid-cols-1 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-600">Admin: </span>
                <span className="text-slate-900 font-semibold">admin@ptit.edu.vn</span> / <span className="text-slate-600 font-medium">admin123</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Lớp trưởng</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-600">User: </span>
                <span className="text-slate-900 font-semibold">sv@ptit.edu.vn</span> / <span className="text-slate-600 font-medium">sv123456</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Sinh viên</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
