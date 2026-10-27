import Link from "next/link";
import { getDeadlines, getSubjects, getUserCompletions } from "@/lib/storage";
import { auth } from "@/auth";
import {
  CalendarDays,
  BookOpen,
  ArrowRight,
  Clock,
  GraduationCap,
} from "lucide-react";
import { DeadlineCard } from "@/components/DeadlineCard";

// Chiến lược Rendering: SSG (Static Site Generation)
export const dynamic = "force-static";

export default async function HomePage() {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();
  const session = await auth();
  const userCompletions = session?.user?.email
    ? await getUserCompletions(session.user.email)
    : [];

  // Đếm số lượng deadline theo từng môn
  const deadlineCountBySubject: Record<string, number> = {};
  deadlines.forEach((dl) => {
    deadlineCountBySubject[dl.subjectSlug] =
      (deadlineCountBySubject[dl.subjectSlug] || 0) + 1;
  });

  const now = new Date().getTime();
  const upcomingDeadlines = deadlines
    .filter((dl) => new Date(dl.dueDate).getTime() >= now)
    .slice(0, 4);

  const overdueCount = deadlines.filter(
    (dl) => new Date(dl.dueDate).getTime() < now
  ).length;

  return (
    <div className="space-y-12 py-2">
      {/* Hero Section */}
      <section className="ui-card p-8 sm:p-10">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
            <span>Học kỳ 1 • Khóa 2023-2028 • Lớp D23CNPM PTIT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Cổng theo dõi và nhắc lịch <br />
            <span className="text-rose-700">Hạn nộp Bài tập & Đồ án</span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
            Tổng hợp và đồng bộ toàn bộ deadline của 4 môn học chuyên ngành học kỳ này.
            Hỗ trợ sinh viên theo dõi tiến độ nộp bài, xem đếm ngược thời gian thực và quản lý trạng thái hoàn thành cá nhân.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/deadlines"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-all cursor-pointer shadow-2xs"
            >
              <CalendarDays className="w-4 h-4" />
              Xem tất cả Deadline ({deadlines.length})
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            >
              Vào Không gian cá nhân
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-slate-100">
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">
              {subjects.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Môn học trọng tâm</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-slate-900">
              {deadlines.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Tổng số Deadline</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-emerald-600">
              {upcomingDeadlines.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Đang chờ hoàn thành</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-extrabold text-rose-600">
              {overdueCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Bài tập đã quá hạn</div>
          </div>
        </div>
      </section>

      {/* Danh sách 4 Môn học */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            Các môn học trong học kỳ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem giảng viên phụ trách, phòng học và danh sách deadline riêng của từng môn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subj) => {
            const count = deadlineCountBySubject[subj.slug] || 0;
            return (
              <Link
                key={subj.slug}
                href={`/subjects/${subj.slug}`}
                className="ui-card ui-card-hover p-5 flex flex-col justify-between group border-l-4"
                style={{ borderLeftColor: subj.color }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {subj.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${subj.color}15`, color: subj.color }}>
                      {count} bài tập
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {subj.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{subj.credits} tín chỉ</span>
                  <span className="text-slate-700 font-semibold group-hover:text-sky-700 flex items-center gap-1">
                    Xem chi tiết <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-700" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mỗi Deadline 1 Thẻ riêng biệt */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-700" />
              Deadline sắp đến hạn (Thẻ bài tập)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mỗi bài tập được hiển thị độc lập trong 1 thẻ hồ sơ chi tiết
            </p>
          </div>
          <Link
            href="/deadlines"
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
          >
            Xem tất cả ({deadlines.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingDeadlines.map((dl) => {
            const subject = subjects.find((s) => s.slug === dl.subjectSlug);
            const isCompleted = userCompletions.includes(dl.id);

            return (
              <DeadlineCard
                key={dl.id}
                deadline={dl}
                subject={subject}
                isCompleted={isCompleted}
                isLoggedIn={!!session?.user}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
