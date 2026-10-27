import { auth } from "@/auth";
import { getDeadlines, getSubjects, getUserCompletions } from "@/lib/storage";
import { redirect } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { DeadlineCard } from "@/components/DeadlineCard";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Deadline của tôi | Class Deadline Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyDeadlinesPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/my-deadlines");
  }

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();
  const userCompletions = await getUserCompletions(session.user.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-slate-800" />
          Toàn bộ Deadline của tôi ({deadlines.length})
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Mỗi bài tập được hiển thị độc lập trong một thẻ hồ sơ riêng để tiện theo dõi và đánh dấu hoàn thành
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deadlines.map((dl) => {
          const subject = subjects.find((s) => s.slug === dl.subjectSlug);
          const isDone = userCompletions.includes(dl.id);

          return (
            <DeadlineCard
              key={dl.id}
              deadline={dl}
              subject={subject}
              isCompleted={isDone}
              isLoggedIn={true}
            />
          );
        })}
      </div>
    </div>
  );
}
