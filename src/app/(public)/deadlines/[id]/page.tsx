import {
  getDeadlineById,
  getDeadlines,
  getSubjectBySlug,
  getUserCompletions,
} from "@/lib/storage";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  BookOpen,
  User,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { Metadata } from "next";

// Chiến lược Rendering: ISR on-demand (làm mới ngay khi admin thêm hoặc xóa)
export const dynamicParams = true;

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((dl) => ({
    id: dl.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return {
      title: "Không tìm thấy Deadline",
      description: "Deadline không tồn tại hoặc đã bị xóa.",
    };
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const title = `${deadline.title} - ${subject?.name || "PTIT"}`;
  const description = deadline.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DeadlineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const session = await auth();
  const userCompletions = session?.user?.email
    ? await getUserCompletions(session.user.email)
    : [];
  const isCompleted = userCompletions.includes(deadline.id);

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const breadcrumbs = [
    { name: "Trang chủ", url: `${baseUrl}` },
    {
      name: subject ? subject.name : "Môn học",
      url: `${baseUrl}/subjects/${deadline.subjectSlug}`,
    },
    { name: deadline.title, url: `${baseUrl}/deadlines/${deadline.id}` },
  ];

  const dateStr = new Date(deadline.dueDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6 py-2">
      {/* Structured Data JSON-LD BreadcrumbList cho Google Tìm kiếm */}
      <JsonLdBreadcrumb items={breadcrumbs} />

      {/* Breadcrumb Navigation tinh tế */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/deadlines" className="hover:text-slate-900 transition-colors">
          Deadlines
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {subject && (
          <>
            <Link
              href={`/subjects/${subject.slug}`}
              className="hover:text-slate-900 transition-colors"
            >
              {subject.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-slate-900 font-semibold truncate max-w-xs">{deadline.title}</span>
      </nav>

      {/* Main Deadline Card */}
      <div className="ui-card p-6 sm:p-8 space-y-6">
        {/* Top Badges & Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {subject && (
              <Link
                href={`/subjects/${subject.slug}`}
                className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block mr-1.5 shrink-0"
                  style={{ backgroundColor: subject.color }}
                />
                {subject.name} ({subject.code})
              </Link>
            )}

            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {deadline.type}
            </span>

            {deadline.priority === "high" && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Ưu tiên cao
              </span>
            )}
          </div>

          <div>
            <CountdownTimer dueDate={deadline.dueDate} isCompleted={isCompleted} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
          {deadline.title}
        </h1>

        {/* Action Panel: Due date info & Complete button */}
        <div className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Thời hạn nộp bài:</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {dateStr}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <MarkCompleteButton
              deadlineId={deadline.id}
              initialCompleted={isCompleted}
              isLoggedIn={!!session?.user}
              size="md"
            />

            {deadline.submissionLink && (
              <a
                href={deadline.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white shadow-2xs transition-all cursor-pointer"
              >
                <span>Nộp bài ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Description & Detailed Instructions */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Yêu cầu và Hướng dẫn thực hiện
          </h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-lg border border-slate-200">
            {deadline.description}
          </div>
        </div>

        {/* Thông tin môn học & Giảng viên phụ trách */}
        {subject && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Thông tin học phần
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Giảng viên hướng dẫn</span>
                </div>
                <div className="text-slate-900 font-bold text-sm">
                  {subject.teacher}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Địa điểm / Phòng học</span>
                </div>
                <div className="text-slate-900 font-bold text-sm">
                  {subject.room}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Môn học & Tín chỉ</span>
                </div>
                <div className="text-slate-900 font-bold text-sm">
                  {subject.name} ({subject.credits} tín chỉ)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
