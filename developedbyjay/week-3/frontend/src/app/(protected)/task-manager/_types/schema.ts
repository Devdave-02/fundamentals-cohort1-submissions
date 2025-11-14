import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  priority: z.enum(["low", "medium", "high"]).nullable(),
  status: z.enum(["pending", "in-progress", "completed"]).nullable(),
  dueDate: z.date().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const taskDefaultValues: TaskFormData = {
  title: "",
  description: "",
  priority: null,
  status: null,
  dueDate: null,
};

const taskFilterSchema = z.object({
  search: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).nullable(),
  status: z.enum(["pending", "in-progress", "completed"]).nullable(),
  sortOrder: z.enum(["asc", "desc"]).nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
});

type TaskFilterData = z.infer<typeof taskFilterSchema>;

const taskFilterDefaultValue: TaskFilterData = {
  search: "",
  priority: null,
  status: null,
  sortOrder: "asc",
  startDate: null,
  endDate: null
};

type GetTaskResponse = {
  _id: string;
  user: string;
} & TaskFormData;

export {
  taskFilterDefaultValue,
  taskFilterSchema,
  taskDefaultValues,
  taskSchema,
  type TaskFormData,
  type TaskFilterData,
  type GetTaskResponse,
};

// https://github.com/developedbyjay/task-manager-FE
