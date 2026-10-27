"use client";

import { useActionState, useState } from "react";
import { PlusCircle, Loader2, Check, AlertCircle, X } from "lucide-react";
import { createDeadlineAction, ActionState } from "@/lib/actions";
import { Subject } from "@/lib/types";

interface AdminDeadlineFormProps {
  subjects: Subject[];
}

export function AdminDeadlineForm({ subjects }: AdminDeadlineFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const res = await createDeadlineAction(prev, formData);
      if (res.success) {
        setIsOpen(false);
      }
      return res;
    },
    {}
  );

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Thêm Deadline mới
        </button>
      ) : (
        <div className="glass-panel p-6 border-indigo-200 bg-white shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Tạo Deadline mới cho lớp
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Thông tin sẽ được lưu trữ và cập nhật đồng bộ tức thì trên toàn hệ thống.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {state?.error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tiêu đề */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề Deadline <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ví dụ: Bài tập lớn Buổi 8 - NextAuth & SEO"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
                {state?.fieldErrors?.title && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">
                    {state.fieldErrors.title[0]}
                  </p>
                )}
              </div>

              {/* Môn học */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Môn học <span className="text-rose-600">*</span>
                </label>
                <select
                  name="subjectSlug"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                >
                  {subjects.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Loại deadline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hình thức <span className="text-rose-600">*</span>
                </label>
                <select
                  name="type"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                >
                  <option value="assignment">Bài tập (Assignment)</option>
                  <option value="project">Đồ án (Project)</option>
                  <option value="lab">Thực hành (Lab)</option>
                  <option value="exam">Thi / Kiểm tra (Exam)</option>
                </select>
              </div>

              {/* Thời hạn nộp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hạn nộp bài <span className="text-rose-600">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Mức ưu tiên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Độ ưu tiên
                </label>
                <select
                  name="priority"
                  defaultValue="medium"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                >
                  <option value="low">Thấp (Low)</option>
                  <option value="medium">Trung bình (Medium)</option>
                  <option value="high">Cao / Gấp (High)</option>
                </select>
              </div>

              {/* Link nộp bài */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn nộp bài (Google Form, LMS, GitHub...)
                </label>
                <input
                  type="url"
                  name="submissionLink"
                  placeholder="https://classroom.google.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả & Hướng dẫn làm bài <span className="text-rose-600">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  placeholder="Ghi chú chi tiết yêu cầu, cách đặt tên file nộp, tiêu chí đánh giá..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Lưu Deadline
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
