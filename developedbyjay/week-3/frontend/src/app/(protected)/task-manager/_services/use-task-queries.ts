

import { useQuery } from "@tanstack/react-query";
import { useTaskStore } from "../_libs/use-task-store";
import { getTask, getTasks } from "./task-queries";

const useTasks = () => {
  const taskFilters = useTaskStore((state) => state.taskFilters);

  return useQuery({
    queryKey: ["tasks", taskFilters],
    queryFn: () => getTasks(taskFilters),
  });
};

const useTask = () => {
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);

  return useQuery({
    queryKey: ["tasks", { selectedTaskId }],
    queryFn: () => getTask(selectedTaskId!),
    enabled: !!selectedTaskId,
  });
};

export { useTasks, useTask };
