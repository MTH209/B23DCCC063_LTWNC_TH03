import { auth } from "@/auth";
import { SidebarNav } from "@/components/SidebarNav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Kiểm tra đăng nhập nhiều lớp (phòng ngừa ngoài Middleware)
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Nested Sidebar Navigation */}
      <SidebarNav userRole={session.user.role} />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">{children}</div>
    </div>
  );
}
