import { createStore } from "@/lib/store/create-store";
import { TaskFilterData, taskFilterDefaultValue } from "../_types/schema";

type State = {
  selectedTaskId: string | null;
  taskDialogOpen: boolean;
  taskFilters: TaskFilterData;
  taskFiltersDrawerOpen: boolean;
};

type Actions = {
  updateSelectedTaskId: (id: State["selectedTaskId"]) => void;
  updateTaskFiltersSearchTerm: (search: State["taskFilters"]["search"]) => void;
  updateTaskDialogOpen: (is: State["taskDialogOpen"]) => void;
  updateTaskFilters: (filters: State["taskFilters"]) => void;
  updateTaskFiltersDrawerOpen: (is: State["taskFiltersDrawerOpen"]) => void;
};

type Store = State & Actions;

const useTaskStore = createStore<Store>(
  (set) => ({
    selectedTaskId: null,
    taskDialogOpen: false,
    taskFilters: taskFilterDefaultValue,
    taskFiltersDrawerOpen: false,

    updateSelectedTaskId: (id) =>
      set((state) => {
        state.selectedTaskId = id;
      }),

    updateTaskDialogOpen: (is) =>
      set((state) => {
        state.taskDialogOpen = is;
      }),
    updateTaskFilters: (filters) =>
      set((state) => {
        state.taskFilters = filters;
      }),

    updateTaskFiltersDrawerOpen: (is) =>
      set((state) => {
        state.taskFiltersDrawerOpen = is;
      }),

    updateTaskFiltersSearchTerm: (search) =>
      set((state) => {
        state.taskFilters.search = search;
      }),
  }),
  {
    name: "task-store",
    excludeFromPersist: ["taskFilters"],
  }
);

export { useTaskStore };
