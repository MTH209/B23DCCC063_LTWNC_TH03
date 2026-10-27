import { getDeadlines, getSubjects, getUserCompletions } from "@/lib/storage";
import { auth } from "@/auth";
import { DeadlineFilter } from "@/components/DeadlineFilter";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";

// Chiến lược Rendering: ISR (Incremental Static Regeneration), làm mới sau 60 giây
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tất cả Deadline | Class Deadline Hub",
  description:
    "Danh sách toàn bộ hạn nộp bài tập, lab, đồ án của tất cả các môn học lớp D23CNPM PTIT. Cập nhật và đồng bộ liên tục.",
};

export default async function DeadlinesPage() {
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();
  const session = await auth();

  const userCompletions = session?.user?.email
    ? await getUserCompletions(session.user.email)
    : [];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Lịch nộp bài tổng hợp</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Tất cả Deadline của Lớp
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
          Theo dõi toàn diện các mốc thời gian bài tập lớn, đồ án và lịch kiểm tra. Tìm kiếm và lọc theo từng môn học hoặc trạng thái nộp bài.
        </p>
      </div>

      {/* Interactive Filter Component (Client) */}
      <DeadlineFilter
        initialDeadlines={deadlines}
        subjects={subjects}
        userCompletions={userCompletions}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
