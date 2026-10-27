"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, ShieldAlert, ArrowLeft } from "lucide-react";

interface SidebarNavProps {
  userRole?: string;
}

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Tổng quan & Tiến độ",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Deadline của tôi",
      href: "/dashboard/my-deadlines",
      icon: CheckSquare,
      exact: false,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="glass-panel p-4 sticky top-24 space-y-6 bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Không gian cá nhân
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {userRole === "admin" && (
          <div className="pt-4 border-t border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 px-3 mb-2">
              Khu vực Lớp trưởng
            </div>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                pathname === "/admin"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                  : "text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Quản trị Deadline</span>
            </Link>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200">
          <Link
            href="/deadlines"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Xem lịch lớp công khai</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
