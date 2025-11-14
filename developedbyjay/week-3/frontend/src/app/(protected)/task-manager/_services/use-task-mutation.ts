import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskFormData } from "../_types/schema";
import { createTask, deleteTask, updateTask } from "./task-mutation";
import { toast } from "sonner";
import { useTaskStore } from "../_libs/use-task-store";

const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaskFormData) => {
      await createTask(data);
    },
    onSuccess: () => {
      toast.success("Task created successfully.");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);

  return useMutation({
    mutationFn: async (data: TaskFormData) => {
      await updateTask(data, selectedTaskId!);
    },
    onSuccess: () => {
      toast.success("Task updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTask(id);
    },
    onSuccess: () => {
      toast.success("Task deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export { useCreateTask, useDeleteTask, useUpdateTask };
