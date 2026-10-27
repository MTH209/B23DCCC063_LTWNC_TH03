import { auth } from "@/auth";
import { getDeadlines, getSubjects, getUserCompletions } from "@/lib/storage";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { DeadlineCard } from "@/components/DeadlineCard";
import { Metadata } from "next";

// Chiến lược Rendering: SSR (Server-Side Rendering)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bảng điều khiển cá nhân | Class Deadline Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();
  const userCompletions = await getUserCompletions(session.user.email);

  const totalDeadlines = deadlines.length;
  const completedCount = userCompletions.length;
  const progressPercent =
    totalDeadlines > 0 ? Math.round((completedCount / totalDeadlines) * 100) : 0;

  // Lọc các deadline cần ưu tiên (chưa xong)
  const pendingDeadlines = deadlines.filter(
    (dl) => !userCompletions.includes(dl.id)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="ui-card p-6 sm:p-7">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <GraduationCap className="w-3.5 h-3.5 text-rose-700" />
            <span>Không gian học tập cá nhân</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Xin chào, {session.user.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            Theo dõi tiến độ bài tập và hoàn thành các deadline học phần. Nhấn hoàn thành sau khi đã nộp bài qua LMS/Google Classroom.
          </p>
        </div>
      </div>

      {/* Progress Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tỷ lệ hoàn thành */}
        <div className="ui-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Tiến độ cá nhân</span>
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {progressPercent}%
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full bg-slate-800 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Đã xong <strong className="text-slate-900 font-bold">{completedCount}</strong> / {totalDeadlines} bài tập
          </div>
        </div>

        {/* Chưa hoàn thành */}
        <div className="ui-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Cần hoàn thành</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600">
              {pendingDeadlines.length}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Cần tập trung giải quyết trước thời hạn
          </div>
        </div>

        {/* Đã hoàn thành */}
        <div className="ui-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Đã hoàn thành</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {completedCount}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Tiếp tục duy trì tiến độ học tập
          </div>
        </div>
      </div>

      {/* Urgent Pending Deadlines as Distinct Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-600" />
            Bài tập cần làm tiếp theo ({pendingDeadlines.length})
          </h2>
          <Link
            href="/dashboard/my-deadlines"
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingDeadlines.length === 0 ? (
          <div className="ui-card p-8 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900">Tuyệt vời!</div>
            <div className="text-xs mt-0.5">
              Bạn đã hoàn thành tất cả các deadline hiện có trên hệ thống!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDeadlines.slice(0, 4).map((dl) => {
              const subject = subjects.find((s) => s.slug === dl.subjectSlug);

              return (
                <DeadlineCard
                  key={dl.id}
                  deadline={dl}
                  subject={subject}
                  isCompleted={false}
                  isLoggedIn={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
