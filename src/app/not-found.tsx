import Link from "next/link";
import { Compass, Home, CalendarDays } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <span className="text-8xl font-black text-slate-200 tracking-widest select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Compass className="w-8 h-8 animate-spin [animation-duration:8s]" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-2">Trang không tồn tại</h1>
      <p className="text-xs text-slate-600 max-w-md mb-8 leading-relaxed font-medium">
        Đường dẫn hoặc mã deadline bạn đang tìm kiếm không tồn tại trên hệ thống hoặc đã bị lớp trưởng gỡ bỏ.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Về Trang chủ
        </Link>
        <Link
          href="/deadlines"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-all cursor-pointer"
        >
          <CalendarDays className="w-4 h-4 text-indigo-600" />
          Xem tất cả Deadline
        </Link>
      </div>
    </div>
  );
}
