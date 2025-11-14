import { createStore } from "@/lib/create-store";

type State = {
  selectedAppointmentId: string | number | null;
  appointmentDialogOpen: boolean;
};

type Actions = {
  updateSelectedAppointmentId: (id: State["selectedAppointmentId"]) => void;
  updateAppointmentDialogOpen: (is: State["appointmentDialogOpen"]) => void;
};

type Store = State & Actions;

const useAppointmentStore = createStore<Store>(
  (set) => ({
    selectedAppointmentId: null,
    appointmentDialogOpen: false,
    updateSelectedAppointmentId: (id) =>
      set((state) => {
        state.selectedAppointmentId = id;
      }),
    updateAppointmentDialogOpen: (is) =>
      set((state) => {
        state.appointmentDialogOpen = is;
      }),
  }),
  {
    name: "appointment-store",
  }
);

export { useAppointmentStore };
