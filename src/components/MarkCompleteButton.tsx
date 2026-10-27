"use client";

import { useTransition, useState } from "react";
import { Check, Loader2, Circle } from "lucide-react";
import { useCompletions } from "@/context/CompletionsContext";
import { toggleCompletionAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
  deadlineId: string;
  initialCompleted?: boolean;
  isLoggedIn?: boolean;
  size?: "sm" | "md";
}

export function MarkCompleteButton({
  deadlineId,
  initialCompleted = false,
  size = "md",
}: MarkCompleteButtonProps) {
  const completionsCtx = useCompletions();
  const [localCompleted, setLocalCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Ưu tiên trạng thái đồng bộ từ context, fallback về localState
  const completed = completionsCtx
    ? completionsCtx.isCompleted(deadlineId)
    : localCompleted;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (completionsCtx) {
      startTransition(async () => {
        await completionsCtx.toggle(deadlineId);
      });
      return;
    }

    // Fallback nếu không có context
    const nextState = !localCompleted;
    setLocalCompleted(nextState);

    startTransition(async () => {
      const res = await toggleCompletionAction(deadlineId);
      if (!res.success) {
        setLocalCompleted(!nextState);
        if (res.requireLogin) {
          router.push(`/login?callbackUrl=/deadlines/${deadlineId}`);
        } else {
          alert(res.error || "Không thể cập nhật trạng thái");
        }
      } else {
        setLocalCompleted(res.completed ?? nextState);
        router.refresh();
      }
    });
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={
        completed
          ? "Nhấn để bỏ đánh dấu hoàn thành"
          : "Nhấn để đánh dấu đã hoàn thành bài tập này"
      }
      className={`group relative inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer shadow-2xs select-none ${
        isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-xs sm:text-sm"
      } ${
        completed
          ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400"
          : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900"
      } ${isPending ? "opacity-75 cursor-wait" : ""}`}
    >
      <div
        className={`flex items-center justify-center rounded-full shrink-0 transition-all ${
          isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
        } ${
          completed
            ? "bg-emerald-600 text-white"
            : "text-slate-400 group-hover:text-slate-600"
        }`}
      >
        {isPending ? (
          <Loader2 className={`animate-spin ${isSmall ? "w-3 h-3 text-slate-500" : "w-3.5 h-3.5 text-slate-500"}`} />
        ) : completed ? (
          <Check className={`${isSmall ? "w-2.5 h-2.5 stroke-[3.5]" : "w-3 h-3 stroke-[3.5]"}`} />
        ) : (
          <Circle className={`${isSmall ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
        )}
      </div>

      <span className="whitespace-nowrap font-semibold">
        {isPending
          ? "Đang lưu..."
          : completed
          ? isSmall
            ? "Đã xong"
            : "Đã hoàn thành"
          : isSmall
          ? "Đánh dấu xong"
          : "Đánh dấu hoàn thành"}
      </span>
    </button>
  );
}
