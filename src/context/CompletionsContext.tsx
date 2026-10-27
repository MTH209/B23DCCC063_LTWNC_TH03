"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getMyCompletionsAction, toggleCompletionAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface CompletionsContextType {
  completedIds: Set<string>;
  isCompleted: (deadlineId: string) => boolean;
  toggle: (deadlineId: string) => Promise<{ success: boolean; completed?: boolean }>;
  isLoading: boolean;
}

const CompletionsContext = createContext<CompletionsContextType | null>(null);

export function CompletionsProvider({
  children,
  initialCompletions = [],
}: {
  children: React.ReactNode;
  initialCompletions?: string[];
}) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(initialCompletions)
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Đồng bộ danh sách deadline đã hoàn thành của người dùng hiện tại từ server
  useEffect(() => {
    let isMounted = true;
    getMyCompletionsAction().then((ids) => {
      if (isMounted && ids.length > 0) {
        setCompletedIds(new Set(ids));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isCompleted = useCallback(
    (deadlineId: string) => completedIds.has(deadlineId),
    [completedIds]
  );

  const toggle = useCallback(
    async (deadlineId: string): Promise<{ success: boolean; completed?: boolean }> => {
      const willBeCompleted = !completedIds.has(deadlineId);

      // Optimistic update ngay lập tức
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (willBeCompleted) {
          next.add(deadlineId);
        } else {
          next.delete(deadlineId);
        }
        return next;
      });

      setIsLoading(true);
      try {
        const res = await toggleCompletionAction(deadlineId);

        if (!res.success) {
          // Rollback nếu thất bại
          setCompletedIds((prev) => {
            const next = new Set(prev);
            if (willBeCompleted) {
              next.delete(deadlineId);
            } else {
              next.add(deadlineId);
            }
            return next;
          });

          if (res.requireLogin) {
            router.push(`/login?callbackUrl=/deadlines/${deadlineId}`);
          } else {
            alert(res.error || "Không thể cập nhật trạng thái");
          }
          return { success: false };
        }

        if (res.completedIds) {
          setCompletedIds(new Set(res.completedIds));
        }
        router.refresh();
        return { success: true, completed: res.completed };
      } catch (err) {
        // Rollback
        setCompletedIds((prev) => {
          const next = new Set(prev);
          if (willBeCompleted) {
            next.delete(deadlineId);
          } else {
            next.add(deadlineId);
          }
          return next;
        });
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    [completedIds, router]
  );

  return (
    <CompletionsContext.Provider
      value={{ completedIds, isCompleted, toggle, isLoading }}
    >
      {children}
    </CompletionsContext.Provider>
  );
}

export function useCompletions() {
  return useContext(CompletionsContext);
}
