"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTaskStore } from "../_libs/use-task-store";
import { useDeleteTask } from "../_services/use-task-mutation";
import { useTasks } from "../_services/use-task-queries";
import { Button } from "@/components/ui/button";
import { alert } from "@/lib/store/global-alert-store";
import { format } from "date-fns";

type UserRole = {
  userRole: string;
};
const TaskCards = ({ userRole }: UserRole) => {
  const { updateSelectedTaskId, updateTaskDialogOpen, taskFilters } =
    useTaskStore();

  const tasksQuery = useTasks();
  const deleteMutation = useDeleteTask();

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tasksQuery.data?.tasks.map((task) => (
        <Card className="w-full" key={task._id}>
          <CardHeader>
            <CardTitle>
              <span className="font-semibold">Title:</span> {task.title}
            </CardTitle>
            <CardDescription>
              <span className="font-semibold">Description:</span>{" "}
              {task.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-2">
            <p>
              <span className="font-medium">Priority</span>: {task.priority}
            </p>
            <p>
              <span className="font-medium">Status:</span> {task.status}
            </p>
            <p className="col-span-2 mt-2">
              <span className="font-medium">Due Date:</span>{" "}
              {format(new Date(task.dueDate), " MMMM d, yyyy")}
            </p>
          </CardContent>

          <CardFooter>
            <CardAction className="flex gap-2 items-center justify-between">
              <Button
                onClick={() => {
                  updateSelectedTaskId(task._id);
                  updateTaskDialogOpen(true);
                }}
                size="default"
              >
                Edit
              </Button>
              {userRole === "admin" && (
                <Button
                  onClick={() => {
                    alert({
                      title: "Delete task",
                      description: "Are you sure you want to delete this task",
                      onConfirm: () => deleteMutation.mutate(task._id),
                    });
                  }}
                  size="default"
                >
                  Delete
                </Button>
              )}
            </CardAction>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export { TaskCards };
