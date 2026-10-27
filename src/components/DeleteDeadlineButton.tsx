"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteDeadlineAction } from "@/lib/actions";

interface DeleteDeadlineButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export function DeleteDeadlineButton({
  deadlineId,
  deadlineTitle,
}: DeleteDeadlineButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteDeadlineAction(deadlineId);
      if (res.success) {
        setShowConfirm(false);
      } else {
        alert(res.error || "Không thể xóa deadline");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        title="Xóa deadline này"
        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="glass-panel p-6 max-w-md w-full bg-white border border-rose-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Xác nhận xóa Deadline</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bạn có chắc chắn muốn xóa deadline{" "}
                  <strong className="text-slate-900">"{deadlineTitle}"</strong>?
                  Hành động này sẽ cập nhật ngay lập tức trên hệ thống và không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Xác nhận xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
