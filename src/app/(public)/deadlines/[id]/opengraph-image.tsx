import { ImageResponse } from "next/og";
import { getDeadlineById, getSubjectBySlug } from "@/lib/storage";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  const subject = deadline ? await getSubjectBySlug(deadline.subjectSlug) : null;

  const title = deadline?.title || "Class Deadline Hub";
  const subjectName = subject?.name || "Lớp D23CNPM PTIT";
  const dueDate = deadline?.dueDate
    ? new Date(deadline.dueDate).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Hạn nộp đang cập nhật";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#0a0f1d",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              📅
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "22px", fontWeight: "bold" }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                Cổng Deadline Lớp D23CNPM - PTIT Hà Đông
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              border: "1px solid rgba(99, 102, 241, 0.5)",
              color: "#a5b4fc",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {subjectName}
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "16px",
              color: "#f43f5e",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            HẠN CHÓT NỘP BÀI
          </span>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "900",
              lineHeight: 1.2,
              color: "#f8fafc",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom Bar: Due Date & Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>⏰</span>
            <span style={{ fontSize: "20px", color: "#cbd5e1" }}>
              Hạn nộp: <strong style={{ color: "#38bdf8" }}>{dueDate}</strong>
            </span>
          </div>

          <div style={{ fontSize: "16px", color: "#64748b" }}>
            Xem chi tiết & Nộp bài tại ptit.edu.vn
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
