"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Deadline, Subject } from "@/lib/types";
import { CountdownTimer } from "./CountdownTimer";
import { MarkCompleteButton } from "./MarkCompleteButton";
import { useCompletions } from "@/context/CompletionsContext";

interface DeadlineCardProps {
  deadline: Deadline;
  subject?: Subject | null;
  isCompleted?: boolean;
  isLoggedIn?: boolean;
}

export function DeadlineCard({
  deadline,
  subject,
  isCompleted = false,
  isLoggedIn = false,
}: DeadlineCardProps) {
  const completionsCtx = useCompletions();
  const effectiveCompleted = completionsCtx
    ? completionsCtx.isCompleted(deadline.id)
    : isCompleted;

  const dateStr = new Date(deadline.dueDate).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const typeLabels: Record<string, string> = {
    assignment: "Bài tập lớn",
    project: "Đồ án môn học",
    lab: "Thực hành Lab",
    exam: "Thi / Kiểm tra",
  };

  return (
    <div
      className={`ui-card ui-card-hover overflow-hidden flex flex-col justify-between group border-l-4 transition-all ${
        effectiveCompleted ? "border-l-emerald-500 bg-emerald-50/20" : ""
      }`}
      style={{
        borderLeftColor: effectiveCompleted
          ? "#10b981"
          : subject?.color || "#be123c",
      }}
    >
      {/* Header Thẻ: Môn học + Countdown */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {subject && (
              <Link
                href={`/subjects/${subject.slug}`}
                className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md transition-colors"
                style={{
                  backgroundColor: `${subject.color}15`,
                  color: subject.color,
                }}
              >
                {subject.name}
              </Link>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {typeLabels[deadline.type] || deadline.type}
            </span>
          </div>

          <CountdownTimer
            dueDate={deadline.dueDate}
            isCompleted={effectiveCompleted}
          />
        </div>

        {/* Tiêu đề bài tập */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors line-clamp-2">
          <Link href={`/deadlines/${deadline.id}`}>
            {deadline.title}
          </Link>
        </h3>

        {/* Mô tả tóm tắt */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">
          {deadline.description}
        </p>
      </div>

      {/* Footer Thẻ: Hạn nộp + Hành động */}
      <div className="px-4 sm:p-5 pt-3 pb-4 bg-slate-50/60 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Hạn nộp: <strong className="text-slate-900 font-semibold">{dateStr}</strong>
            </span>
          </div>
          {deadline.priority === "high" && (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              Ưu tiên
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <MarkCompleteButton
            deadlineId={deadline.id}
            initialCompleted={effectiveCompleted}
            isLoggedIn={isLoggedIn}
            size="sm"
          />

          <Link
            href={`/deadlines/${deadline.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-rose-700 transition-colors"
          >
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
