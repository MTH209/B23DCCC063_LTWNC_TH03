import Link from "next/link";
import { auth } from "@/auth";
import { CalendarDays, BookOpen } from "lucide-react";
import { NavbarUserSection } from "./NavbarUserSection";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo PTIT */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-rose-700 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:bg-rose-800 transition-colors">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-2">
              <span>Class Deadline Hub</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                PTIT D23
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Học viện CNBCVT - Lớp D23CNPM</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="/deadlines"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
            Tất cả Deadline
          </Link>
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Môn học
            </button>
            <div className="absolute top-full left-0 mt-1 w-64 rounded-xl p-2 shadow-lg opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-150 bg-white border border-slate-200">
              <Link
                href="/subjects/lap-trinh-web"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50/60 transition-colors"
              >
                Lập trình Web (INT1434)
              </Link>
              <Link
                href="/subjects/ctdl-gt"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50/60 transition-colors"
              >
                Cấu trúc DL & Giải thuật (INT1306)
              </Link>
              <Link
                href="/subjects/csdl-phan-tan"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50/60 transition-colors"
              >
                Cơ sở dữ liệu phân tán (INT1415)
              </Link>
              <Link
                href="/subjects/attt"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50/60 transition-colors"
              >
                An toàn thông tin mạng (INT1440)
              </Link>
            </div>
          </div>
        </nav>

        {/* Dynamic User Session Area */}
        <NavbarUserSection serverUser={user} />
      </div>
    </header>
  );
}
