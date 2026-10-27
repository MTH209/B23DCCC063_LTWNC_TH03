import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { getDeadlines, getSubjects } from "@/lib/storage";
import { redirect } from "next/navigation";
import {
  ShieldAlert,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { AdminDeadlineForm } from "@/components/AdminDeadlineForm";
import { DeleteDeadlineButton } from "@/components/DeleteDeadlineButton";
import Link from "next/link";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Metadata } from "next";

// Chiến lược Rendering: SSR (Server-Side Rendering)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị Deadline Lớp | Class Deadline Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await auth();

  // Kiểm tra xác thực (Chưa đăng nhập -> redirect /login)
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Kiểm tra phân quyền đa lớp (Defense in depth) bằng hàm can(role, action)
  if (!can(session.user.role, "create_deadline")) {
    redirect("/403");
  }

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="space-y-6 py-2">
      {/* Header Quản trị */}
      <div className="ui-card p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Khu vực Ban Cán Sự Lớp</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Bảng Quản Trị Deadline — Lớp D23CNPM
          </h1>
          <p className="text-xs text-slate-500 max-w-xl font-medium">
            Thêm mới và xóa deadline của học phần. Mọi thay đổi sẽ được cập nhật đồng bộ ngay lập tức trên toàn bộ cổng thông tin.
          </p>
        </div>

        <div>
          <AdminDeadlineForm subjects={subjects} />
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="ui-card p-4">
          <div className="text-xs text-slate-500 font-medium mb-0.5">
            Tổng số Deadline
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {deadlines.length}
          </div>
        </div>
        <div className="ui-card p-4">
          <div className="text-xs text-slate-500 font-medium mb-0.5">
            Tổng số Môn học
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {subjects.length}
          </div>
        </div>
        <div className="ui-card p-4">
          <div className="text-xs text-slate-500 font-medium mb-0.5">
            Vai trò phiên làm việc
          </div>
          <div className="text-sm font-bold text-rose-700 mt-1">
            Lớp trưởng (Admin)
          </div>
        </div>
        <div className="ui-card p-4">
          <div className="text-xs text-slate-500 font-medium mb-0.5">
            Quyền hạn thao tác
          </div>
          <div className="text-sm font-bold text-emerald-700 mt-1">
            Thêm & Xoá bài
          </div>
        </div>
      </div>

      {/* Bảng Danh sách Quản lý Deadline */}
      <div className="ui-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              Danh sách Deadline đang quản lý ({deadlines.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin có quyền xóa hoặc xem chi tiết từng bài tập
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tiêu đề bài tập</th>
                <th className="py-3 px-4">Môn học</th>
                <th className="py-3 px-4">Loại bài</th>
                <th className="py-3 px-4">Hạn nộp</th>
                <th className="py-3 px-4">Đếm ngược</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deadlines.map((dl) => {
                const subject = subjects.find((s) => s.slug === dl.subjectSlug);
                const dateStr = new Date(dl.dueDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={dl.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 max-w-xs truncate">
                        <Link
                          href={`/deadlines/${dl.id}`}
                          className="hover:text-rose-700 transition-colors"
                        >
                          {dl.title}
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate">
                        {dl.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] inline-flex items-center">
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 shrink-0"
                          style={{ backgroundColor: subject?.color }}
                        />
                        {subject?.name || dl.subjectSlug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-slate-600">
                      {dl.type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CountdownTimer dueDate={dl.dueDate} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/deadlines/${dl.id}`}
                          title="Xem chi tiết"
                          className="p-1.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <DeleteDeadlineButton
                          deadlineId={dl.id}
                          deadlineTitle={dl.title}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
