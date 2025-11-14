"use server";

import { executeActions } from "@/lib/execute-action";
import { TaskFormData, taskSchema } from "../_types/schema";
import { apiClient } from "@/lib/request";
import { getAccessTokenFromHeaders, getUserIdFromHeaders } from "@/lib/auth";

const createTask = async (data: TaskFormData) => {
  const userId = await getUserIdFromHeaders();
  const accessToken = await getAccessTokenFromHeaders();
  await executeActions({
    actionFn: async () => {
      const validatedData = taskSchema.parse(data);
      await apiClient.post<TaskFormData>(
        "/tasks",
        {
          title: validatedData.title,
          description: validatedData.description,
          priority: validatedData.priority,
          status: validatedData.status,
          dueDate: new Date(validatedData.dueDate),
          user: userId,
        },
        accessToken
      );
    },
  });
};

const updateTask = async (data: TaskFormData, taskId: string) => {
  const accessToken = await getAccessTokenFromHeaders();
  const validatedData = taskSchema.parse(data);
  await executeActions({
    actionFn: async () => {
      await apiClient.patch<TaskFormData>(
        `/tasks/${taskId}`,
        {
          title: validatedData.title,
          description: validatedData.description,
          priority: validatedData.priority,
          status: validatedData.status,
          dueDate: new Date(validatedData.dueDate),
        },
        accessToken
      );
    },
  });
};

const deleteTask = async (id: string) => {
  const accessToken = await getAccessTokenFromHeaders();

  await executeActions({
    actionFn: async () => {
      await apiClient.delete(`/tasks/${id}`, {}, accessToken);
    },
  });
};

export { createTask, updateTask, deleteTask };
