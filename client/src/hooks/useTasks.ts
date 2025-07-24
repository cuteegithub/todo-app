import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";

export function useTasks() {
  const { data: tasks, isLoading, error, refetch } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    retry: false,
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
  };
}
