import { getSubjectBySlug, getSubjects, getDeadlinesBySubject, getUserCompletions } from "@/lib/storage";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { DeadlineCard } from "@/components/DeadlineCard";
import { Metadata } from "next";

// Chiến lược Rendering: SSG (Static Site Generation)
export const dynamic = "force-static";

// Tạo tĩnh tất cả các trang môn học lúc build
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subj) => ({
    slug: subj.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return { title: "Không tìm thấy môn học" };
  }

  return {
    title: `${subject.name} (${subject.code})`,
    description: `Xem toàn bộ deadline và thông tin học phần môn ${subject.name} - Giảng viên ${subject.teacher}.`,
  };
}

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const subjectDeadlines = await getDeadlinesBySubject(slug);
  const session = await auth();
  const userCompletions = session?.user?.email
    ? await getUserCompletions(session.user.email)
    : [];

  return (
    <div className="space-y-8 py-2">
      {/* Nút quay lại */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trang chủ</span>
        </Link>
      </div>

      {/* Header Môn học */}
      <section className="ui-card p-6 sm:p-8 space-y-4 border-l-4" style={{ borderLeftColor: subject.color }}>
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {subject.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {subject.badge}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {subject.credits} Tín chỉ
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {subject.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {subject.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>Giảng viên: <strong className="text-slate-900 font-bold">{subject.teacher}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Phòng học: <strong className="text-slate-900 font-bold">{subject.room}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách Thẻ Deadline của môn học */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            Danh sách Thẻ bài tập & Deadline ({subjectDeadlines.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mỗi bài tập được đóng gói trong 1 thẻ hồ sơ rõ ràng
          </p>
        </div>

        {subjectDeadlines.length === 0 ? (
          <div className="ui-card p-8 text-center text-xs text-slate-500">
            Hiện tại chưa có deadline nào được giao cho môn học này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectDeadlines.map((dl) => {
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
        )}
      </section>
    </div>
  );
}
