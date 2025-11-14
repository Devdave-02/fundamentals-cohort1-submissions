"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppointmentStore } from "../_libs/appointment-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import {
  appointmentSchema,
  appointmentDefaultValues,
  AppointmentSchema,
} from "../_types/appointment-types";

import { ControlledTextArea } from "@/components/ui/controlled/controlled-textarea";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { ControlledDatePicker } from "@/components/ui/controlled/controlled-datepicker";
import { useDoctors, useAppointments } from "../_services/use-queries";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "../_services/use-mutation";

const AppointmentFormDialog = () => {
  const {
    appointmentDialogOpen,
    updateAppointmentDialogOpen,
    updateSelectedAppointmentId,
    selectedAppointmentId,
  } = useAppointmentStore();

  const doctorsQuery = useDoctors();
  const appointmentsQuery = useAppointments();
  const createAppointmentMutation = useCreateAppointment();
  const updateAppointmentMutation = useUpdateAppointment();

  const isPending =
    createAppointmentMutation.isPending || updateAppointmentMutation.isPending;

  const form = useForm<AppointmentSchema>({
    defaultValues: appointmentDefaultValues,
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (!!selectedAppointmentId && appointmentsQuery.data?.data) {
      const appointmentToEdit = appointmentsQuery.data.data.find(
        (appointment) => appointment._id === selectedAppointmentId
      );

      if (appointmentToEdit) {
        form.reset({
          _id: appointmentToEdit._id,
          doctorId: appointmentToEdit.doctorId._id,
          date: new Date(appointmentToEdit.date),
          reason: appointmentToEdit.reason,
        });
      }
    } else if (!selectedAppointmentId) {
      form.reset(appointmentDefaultValues);
    }
  }, [selectedAppointmentId, appointmentsQuery.data, form]);

  const handleDialogOpenChange = (open: boolean) => {
    updateAppointmentDialogOpen(open);

    if (!open) {
      updateSelectedAppointmentId(null);
      form.reset(appointmentDefaultValues);
    }
  };

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };

  const onSubmit: SubmitHandler<AppointmentSchema> = (data) => {
    if (selectedAppointmentId) {
   
      updateAppointmentMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
      return;
    }
    createAppointmentMutation.mutate(data, {
      onSuccess: handleSuccess,
    });
  };

  return (
    <Dialog open={appointmentDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          New Appointment
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full" aria-describedby="appointment">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedAppointmentId
              ? "Edit Appointment"
              : "Create a New Appointment "}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormProvider {...form}>
            <div className="grid gap-x-4 grid-cols-2 space-y-4">
              <div>
                <ControlledDatePicker<AppointmentSchema>
                  name="date"
                  label="Select convenient date"
                />
              </div>
              <div>
                <ControlledSelect<AppointmentSchema>
                  name="doctorId"
                  label="Select your doctor"
                  placeholder="Select doctor"
                  options={doctorsQuery.data?.data.map((item) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </div>

              <div className="w-full col-span-2">
                <ControlledTextArea<AppointmentSchema>
                  name="reason"
                  label="Reason for appointment"
                />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit" isLoading={isPending}>
              {!!selectedAppointmentId ? "Edit" : "Create"} Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AppointmentFormDialog };
