import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppointmentSchema } from "../_types/appointment-types";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "./mutations";
import { toast } from "sonner";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppointmentSchema) => {
      await createAppointment(data);
    },
    onSuccess: () => {
      toast.success("Appointment created successfully");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppointmentSchema) => {
      await updateAppointment(data);
    },
    onSuccess: () => {
      toast.success("Appointment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteAppointment(id);
    },
    onSuccess: () => {
      toast.success("Appointment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
