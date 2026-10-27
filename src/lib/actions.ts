"use server";

import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import {
  createDeadline,
  deleteDeadline,
  getDeadlineById,
  getUserCompletions,
  toggleUserCompletion,
} from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/* =================== VALIDATION SCHEMAS =================== */

const CreateDeadlineSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(150, "Tiêu đề không quá 150 ký tự"),
  description: z.string().min(5, "Mô tả yêu cầu phải có ít nhất 5 ký tự"),
  subjectSlug: z.enum(
    ["lap-trinh-web", "ctdl-gt", "csdl-phan-tan", "attt"],
    { message: "Môn học không hợp lệ" }
  ),
  dueDate: z
    .string()
    .min(1, "Vui lòng chọn thời hạn nộp bài")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Định dạng ngày giờ không hợp lệ",
    }),
  type: z.enum(["assignment", "project", "lab", "exam"], {
    message: "Loại deadline không hợp lệ",
  }),
  submissionLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("http://") || val.startsWith("https://"),
      {
        message: "Link nộp bài phải bắt đầu bằng http:// hoặc https://",
      }
    ),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

/* =================== ACTIONS =================== */

/**
 * Server Action: Lấy danh sách ID deadline đã hoàn thành của người dùng hiện tại
 */
export async function getMyCompletionsAction(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }
  return getUserCompletions(session.user.email);
}

/**
 * Server Action: Đánh dấu hoàn thành / bỏ hoàn thành deadline cho sinh viên
 */
export async function toggleCompletionAction(deadlineId: string) {
  const session = await auth();

  // Kiểm tra quyền: Chỉ user hoặc admin mới có quyền đánh dấu đã xong
  if (!session?.user?.email || !can(session.user.role, "mark_completed")) {
    return {
      success: false,
      requireLogin: true,
      error: "Bạn cần đăng nhập tài khoản để đánh dấu hoàn thành bài tập.",
    };
  }

  if (!deadlineId || typeof deadlineId !== "string") {
    return { success: false, error: "ID deadline không hợp lệ" };
  }

  try {
    const result = await toggleUserCompletion(session.user.email, deadlineId);

    // Revalidate lại các trang hiển thị trạng thái deadline
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-deadlines");
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${deadlineId}`);

    return {
      success: true,
      completed: result.completed,
      completedIds: result.completedIds,
    };
  } catch (err) {
    console.error("Lỗi khi toggle completion:", err);
    return { success: false, error: "Có lỗi xảy ra khi cập nhật trạng thái" };
  }
}

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: any;
};

/**
 * Server Action: Thêm deadline mới (Chỉ dành cho Lớp trưởng / Admin)
 * Tự động kiểm tra quyền và revalidate ngay lập tức (On-demand ISR)
 */
export async function createDeadlineAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  // Kiểm tra quyền nghiêm ngặt phía server
  if (!session?.user || !can(session.user.role, "create_deadline")) {
    return {
      success: false,
      error: "Truy cập bị từ chối: Chỉ Lớp trưởng (Admin) mới có quyền thêm deadline.",
    };
  }

  const rawData = {
    title: formData.get("title")?.toString().trim() || "",
    description: formData.get("description")?.toString().trim() || "",
    subjectSlug: formData.get("subjectSlug")?.toString().trim() || "",
    dueDate: formData.get("dueDate")?.toString().trim() || "",
    type: formData.get("type")?.toString().trim() || "assignment",
    submissionLink: formData.get("submissionLink")?.toString().trim() || "",
    priority: formData.get("priority")?.toString().trim() || "medium",
  };

  const parsed = CreateDeadlineSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại các trường.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const newDeadline = await createDeadline(parsed.data);

    // Revalidate ngay lập tức (On-demand revalidation)
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${newDeadline.id}`);
    revalidatePath("/");
    revalidatePath(`/subjects/${newDeadline.subjectSlug}`);
    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: newDeadline,
    };
  } catch (err) {
    console.error("Lỗi khi tạo deadline:", err);
    return {
      success: false,
      error: "Không thể lưu deadline vào hệ thống. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Xóa deadline (Chỉ dành cho Lớp trưởng / Admin)
 * Tự động kiểm tra quyền và revalidate ngay lập tức (On-demand ISR)
 */
export async function deleteDeadlineAction(deadlineId: string): Promise<ActionState> {
  const session = await auth();

  // Kiểm tra quyền nghiêm ngặt phía server
  if (!session?.user || !can(session.user.role, "delete_deadline")) {
    return {
      success: false,
      error: "Truy cập bị từ chối: Chỉ Lớp trưởng (Admin) mới có quyền xóa deadline.",
    };
  }

  if (!deadlineId || typeof deadlineId !== "string") {
    return {
      success: false,
      error: "ID deadline không hợp lệ",
    };
  }

  try {
    const existing = await getDeadlineById(deadlineId);
    if (!existing) {
      return {
        success: false,
        error: "Không tìm thấy deadline cần xóa.",
      };
    }

    await deleteDeadline(deadlineId);

    // Revalidate ngay lập tức
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${deadlineId}`);
    revalidatePath("/");
    revalidatePath(`/subjects/${existing.subjectSlug}`);
    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (err) {
    console.error("Lỗi khi xóa deadline:", err);
    return {
      success: false,
      error: "Có lỗi xảy ra khi xóa deadline.",
    };
  }
}
