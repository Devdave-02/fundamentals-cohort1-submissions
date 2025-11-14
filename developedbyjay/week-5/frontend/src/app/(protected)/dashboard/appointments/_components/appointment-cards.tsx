"use client";

import { format } from "date-fns";
import { useAppointmentStore } from "../_libs/appointment-store";
import { useAppointments } from "../_services/use-queries";
import { AppointmentCardsSkeleton } from "./appointment-cards-skeleton";
import { Button } from "@/components/ui/button";
import { alert } from "@/lib/use-global-store";
import { useDeleteAppointment } from "../_services/use-mutation";

export const AppointmentCards = () => {
  const { updateAppointmentDialogOpen, updateSelectedAppointmentId } =
    useAppointmentStore();

  const appointmentQuery = useAppointments();
  const deleteAppointment = useDeleteAppointment();

  const isPending = deleteAppointment.isPending || appointmentQuery.isPending;
  return (
    <>
      {appointmentQuery.isLoading ? (
        <AppointmentCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {appointmentQuery.data?.data.map((item) => (
            <div
              key={item._id}
              className="w-full space-y-4 border p-4 rounded-lg min-h-[200px]"
            >
              <div className=" flex justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm">Doctor name</span>
                  <span className="font-medium">{item.doctorId.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">Scheduled Date</span>
                  <span className="font-medium">
                    {format(item.date, "PPP")}
                  </span>
                </div>
              </div>
              <p className="flex  flex-col gap-1">
                <span>Reason:</span>
                <span className="font-medium">{item.reason}</span>
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    updateSelectedAppointmentId(item._id);
                    updateAppointmentDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  isLoading={isPending}
                  onClick={() => {
                    alert({
                      title: "Delete Appointment",
                      description:
                        "Are you sure you want to delete this appointment",
                      onConfirm: () => deleteAppointment.mutate(item._id),
                    });
                  }}
                  variant="outline"
                  size="lg"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
