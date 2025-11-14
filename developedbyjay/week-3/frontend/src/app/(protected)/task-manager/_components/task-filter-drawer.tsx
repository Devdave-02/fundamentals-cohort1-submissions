"use client";

import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  TaskFilterData,
  taskFilterDefaultValue,
  taskFilterSchema,
} from "../_types/schema";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { useTaskStore } from "../_libs/use-task-store";
import { useDebounce } from "@/lib/use-debounce";
import { useEffect } from "react";
import { ControlledDatePicker } from "@/components/ui/controlled/controlled-date-picker";

export const TaskFiltersDrawer = () => {
  const form = useForm<TaskFilterData>({
    defaultValues: taskFilterDefaultValue,
    resolver: zodResolver(taskFilterSchema),
  });

  const searchTerm = useWatch({ control: form.control, name: "search" });
  const debouncedSearchTerm = useDebounce(searchTerm!);

  const {
    taskFiltersDrawerOpen,
    updateTaskFilters,
    updateTaskFiltersDrawerOpen,
    updateTaskFiltersSearchTerm,
  } = useTaskStore();

  useEffect(() => {
    updateTaskFiltersSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateTaskFiltersSearchTerm]);

  const onSubmit: SubmitHandler<TaskFilterData> = (data) => {
    updateTaskFilters(data);
    updateTaskFiltersDrawerOpen(false);
  };

  return (
    <Drawer
      open={taskFiltersDrawerOpen}
      onOpenChange={updateTaskFiltersDrawerOpen}
      direction="right"
      handleOnly
    >
      <FormProvider {...form}>
        <div className="flex gap-2 items-center">
          <ControlledInput<TaskFilterData>
            containerClassName="max-w-48"
            name="search"
            placeholder="Quick task search"
          />

          <DrawerTrigger asChild>
            <Button variant="outline">
              <FilterIcon />
              Filters
            </Button>
          </DrawerTrigger>
        </div>

        <form>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Customize your task search criteria
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-2 p-4">
              <div className="flex flex-col gap-2">
                <ControlledSelect<TaskFilterData>
                  name="priority"
                  clearable
                  label="Priority"
                  placeholder="Select the task priority"
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                />

                <ControlledSelect<TaskFilterData>
                  name="status"
                  label="Status"
                  clearable
                  placeholder="Select the task status"
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "In-progress", value: "in-progress" },
                    { label: "Completed", value: "completed" },
                  ]}
                />

                <ControlledSelect<TaskFilterData>
                  label="Sort Order"
                  name="sortOrder"
                  options={[
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                  ]}
                />

                <div className="flex w-full items-center gap-1 justify-between">
                  <div>
                    <ControlledDatePicker<TaskFilterData>
                      label="Start Date"
                      name="startDate"

                    />
                  </div>
                  <div>
                    <ControlledDatePicker<TaskFilterData>
                      label="End Date"
                      name="endDate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                 { console.log(taskFilterDefaultValue)}
                  form.reset(taskFilterDefaultValue);
                }}
              >
                Reset
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Apply Filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </FormProvider>
    </Drawer>
  );
};
