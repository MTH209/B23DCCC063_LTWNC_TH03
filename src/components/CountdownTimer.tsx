"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CountdownTimerProps {
  dueDate: string;
  isCompleted?: boolean;
}

export function CountdownTimer({ dueDate, isCompleted = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    text: string;
    isOverdue: boolean;
    isUrgent: boolean;
  }>({
    text: "Đang tính toán...",
    isOverdue: false,
    isUrgent: false,
  });

  useEffect(() => {
    function calculate() {
      const target = new Date(dueDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        const overdueHours = Math.floor(
          (Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        let text = "";
        if (overdueDays > 0) {
          text = `Quá hạn ${overdueDays} ngày`;
        } else {
          text = `Quá hạn ${overdueHours} giờ`;
        }

        setTimeLeft({
          text,
          isOverdue: true,
          isUrgent: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let text = "";
      if (days > 0) {
        text = `Còn ${days} ngày ${hours} giờ`;
      } else if (hours > 0) {
        text = `Còn ${hours} giờ ${minutes} phút`;
      } else {
        text = `Còn ${minutes} phút!`;
      }

      setTimeLeft({
        text,
        isOverdue: false,
        isUrgent: days < 3,
      });
    }

    calculate();
    const timer = setInterval(calculate, 60000);
    return () => clearInterval(timer);
  }, [dueDate]);

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Đã hoàn thành
      </span>
    );
  }

  if (timeLeft.isOverdue) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" />
        {timeLeft.text}
      </span>
    );
  }

  if (timeLeft.isUrgent) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        {timeLeft.text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
      <Clock className="w-3.5 h-3.5 text-indigo-600" />
      {timeLeft.text}
    </span>
  );
}
