"use client";

import { useState, useMemo } from "react";
import { Deadline, Subject } from "@/lib/types";
import { Search, BookOpen } from "lucide-react";
import { DeadlineCard } from "./DeadlineCard";
import { useCompletions } from "@/context/CompletionsContext";

interface DeadlineFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  userCompletions: string[];
  isLoggedIn: boolean;
}

export function DeadlineFilter({
  initialDeadlines,
  subjects,
  userCompletions,
  isLoggedIn,
}: DeadlineFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "overdue" | "completed" | "uncompleted"
  >("all");
  const [sortBy, setSortBy] = useState<"due_asc" | "due_desc" | "title">("due_asc");

  const subjectMap = useMemo(() => {
    const map = new Map<string, Subject>();
    subjects.forEach((s) => map.set(s.slug, s));
    return map;
  }, [subjects]);

  const completionsCtx = useCompletions();

  const filteredDeadlines = useMemo(() => {
    const now = new Date().getTime();
    const effectiveCompletions = completionsCtx
      ? completionsCtx.completedIds
      : new Set(userCompletions);

    return initialDeadlines
      .filter((dl) => {
        // Lọc môn học
        if (selectedSubject !== "all" && dl.subjectSlug !== selectedSubject) {
          return false;
        }

        // Lọc trạng thái
        const isDone = effectiveCompletions.has(dl.id);
        const isPast = new Date(dl.dueDate).getTime() < now;

        if (statusFilter === "completed" && !isDone) return false;
        if (statusFilter === "uncompleted" && isDone) return false;
        if (statusFilter === "active" && isPast) return false;
        if (statusFilter === "overdue" && !isPast) return false;

        // Lọc tìm kiếm
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = dl.title.toLowerCase().includes(query);
          const matchDesc = dl.description.toLowerCase().includes(query);
          const subj = subjectMap.get(dl.subjectSlug);
          const matchSubj = subj ? subj.name.toLowerCase().includes(query) : false;
          if (!matchTitle && !matchDesc && !matchSubj) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "due_asc") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === "due_desc") {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [initialDeadlines, selectedSubject, statusFilter, searchTerm, sortBy, userCompletions, subjectMap]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="ui-card p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Ô tìm kiếm */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm deadline, môn học..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Lọc Môn học */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Lọc Trạng thái */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang diễn ra</option>
              <option value="overdue">Đã quá hạn</option>
              <option value="uncompleted">Chưa hoàn thành</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            >
              <option value="due_asc">Hạn gần nhất</option>
              <option value="due_desc">Hạn xa nhất</option>
              <option value="title">Theo tên A-Z</option>
            </select>
          </div>
        </div>

        {/* Thống kê kết quả lọc */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị <span className="font-bold text-slate-900">{filteredDeadlines.length}</span> / {initialDeadlines.length} deadline
          </div>
          {(searchTerm || selectedSubject !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
                setStatusFilter("all");
              }}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Danh sách Thẻ bài tập độc lập */}
      {filteredDeadlines.length === 0 ? (
        <div className="ui-card p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy deadline phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại các tiêu chí lọc.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeadlines.map((dl) => {
            const subject = subjectMap.get(dl.subjectSlug);
            const isCompleted = userCompletions.includes(dl.id);

            return (
              <DeadlineCard
                key={dl.id}
                deadline={dl}
                subject={subject}
                isCompleted={isCompleted}
                isLoggedIn={isLoggedIn}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
