"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, ShieldAlert, LogOut, LogIn } from "lucide-react";

interface NavbarUserSectionProps {
  serverUser?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
}

export function NavbarUserSection({ serverUser }: NavbarUserSectionProps) {
  const { data: session } = useSession();
  const user = session?.user || serverUser;

  if (user) {
    return (
      <div className="flex items-center gap-2.5">
        {/* Role & Dashboard quick links */}
        <Link
          href="/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
          Dashboard
        </Link>

        {user.role === "admin" && (
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Admin
          </Link>
        )}

        {/* User Profile Capsule */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight max-w-[130px] truncate">
              {user.name}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {user.role === "admin" ? (
                <span className="text-[10px] font-bold text-rose-700">
                  Lớp trưởng
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500">
                  Sinh viên
                </span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Đăng xuất"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-all cursor-pointer shadow-2xs"
      >
        <LogIn className="w-3.5 h-3.5" />
        Đăng nhập
      </Link>
    </div>
  );
}
