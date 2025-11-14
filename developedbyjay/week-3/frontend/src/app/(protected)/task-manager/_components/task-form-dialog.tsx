"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { taskDefaultValues, TaskFormData, taskSchema } from "../_types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "../_libs/use-task-store";
import { useTask } from "../_services/use-task-queries";
import { useCreateTask, useUpdateTask } from "../_services/use-task-mutation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { ControlledDatePicker } from "@/components/ui/controlled/controlled-date-picker";
import { useEffect } from "react";

export const TaskFormDialog = () => {
  const form = useForm<TaskFormData>({
    defaultValues: taskDefaultValues,
    resolver: zodResolver(taskSchema),
  });

  const taskQuery = useTask();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const {
    selectedTaskId,
    updateSelectedTaskId,
    taskDialogOpen,
    updateTaskDialogOpen,
  } = useTaskStore();

  useEffect(() => {
    if (!!selectedTaskId && taskQuery.data) {
      form.reset(taskQuery.data!);
    }
  }, [selectedTaskId, form, taskQuery.data]);

  const handleDialogueOpenChange = (open: boolean) => {
    updateTaskDialogOpen(open);

    if (!open) {
      updateSelectedTaskId(null);
      form.reset(taskDefaultValues);
    }
  };

  const handleSuccess = () => {
    handleDialogueOpenChange(false);
  };
  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    if (!!selectedTaskId) {
      updateTaskMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
      return;
    }
    createTaskMutation.mutate(data, {
      onSuccess: handleSuccess,
    });
  };

  const isPending =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <Dialog open={taskDialogOpen} onOpenChange={handleDialogueOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-gray-400"
          size="default"
          variant="ghost"
          type="button"
        >
          <Plus className="mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className=" w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {!!selectedTaskId ? "Edit Task" : "Create a New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <ControlledInput<TaskFormData>
                name="title"
                type="text"
                label="Title"
                placeholder="Enter the task title"
              />
              <ControlledInput<TaskFormData>
                name="description"
                label="Description"
                placeholder="Enter the task description"
              />
              <ControlledSelect<TaskFormData>
                name="priority"
                label="Priority"
                placeholder="Select the task priority"
                options={[
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ]}
              />

              {!!selectedTaskId && (
                <ControlledSelect<TaskFormData>
                  name="status"
                  label="Status"
                  placeholder="Select the task status"
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "In-progress", value: "in-progress" },
                    { label: "Completed", value: "completed" },
                  ]}
                />
              )}
              <div>
                <ControlledDatePicker<TaskFormData>
                  label="Due Date"
                  name="dueDate"
                />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit" isLoading={isPending}>
              {!!selectedTaskId ? "Edit" : "Create"} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
