"use server";

import { executeActions } from "@/lib/execute-action";
import {
  GetTaskResponse,
  TaskFilterData,
  taskFilterSchema,
  TaskFormData,
} from "../_types/schema";
import { apiClient } from "@/lib/request";
import { PaginatedResult } from "@/lib/types";
import { getAccessTokenFromHeaders } from "@/lib/auth";

const getTask = async (id: string) => {
  const accessToken = await getAccessTokenFromHeaders();
  const res = await executeActions({
    actionFn: () =>
      apiClient.get<{ task: GetTaskResponse }>(`/tasks/${id}`, accessToken),
  });

  const result = res.task;

  return {
    description: result.description,
    dueDate: new Date(result.dueDate!),
    priority: result.priority,
    status: result.status,
    title: result.title,
  };
};

const getTasks = async (
  filters: TaskFilterData
): Promise<PaginatedResult<GetTaskResponse> | null> => {
  const validatedFilters = taskFilterSchema.parse(filters);

  const queryString = new URLSearchParams(
    Object.entries(validatedFilters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const accessToken = await getAccessTokenFromHeaders();
  const url = queryString ? `/tasks?${queryString}` : "/tasks";

  const response = await executeActions({
    actionFn: () =>
      apiClient.get<{
        tasks: GetTaskResponse[];
        meta: PaginatedResult<GetTaskResponse>["meta"];
      }>(url, accessToken),
  });

  return {
    tasks: response.tasks,
    meta: {
      total: response.meta.total,
      limit: response.meta.limit,
      offset: response.meta.offset,
      page: response.meta.page,
      totalPages: response.meta.totalPages,
    },
  };
};

export { getTask, getTasks };
