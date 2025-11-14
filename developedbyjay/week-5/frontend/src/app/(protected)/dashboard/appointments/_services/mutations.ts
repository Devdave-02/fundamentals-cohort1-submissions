"use server";

import { executeActions } from "@/lib/execute-action";
import {
  appointmentSchema,
  AppointmentSchema,
} from "../_types/appointment-types";
import { apiClient } from "@/lib/request";
import { getAccessTokenFromHeaders } from "@/lib/auth";

export const createAppointment = async (data: AppointmentSchema) => {
  const accessToken = await getAccessTokenFromHeaders();
  const validatedData = appointmentSchema.parse(data);
  return executeActions({
    actionFn: () =>
      apiClient.post(
        "/appointment/",
        {
          doctorId: validatedData.doctorId,
          reason: validatedData.reason,
          date: new Date(validatedData.date),
        },
        accessToken
      ),
  });
};

export const updateAppointment = async (data: AppointmentSchema) => {
  const accessToken = await getAccessTokenFromHeaders();
  const validatedData = appointmentSchema.parse(data);
  console.log(validatedData);
  return executeActions({
    actionFn: () =>
      apiClient.patch(
        `/appointment/${data._id}`,
        {
          doctorId: validatedData.doctorId,
          reason: validatedData.reason,
          date: validatedData.date,
        },
        accessToken
      ),
  });
};

export const deleteAppointment = async (id: string) => {
  const accessToken = await getAccessTokenFromHeaders();
  executeActions({
    actionFn: () => apiClient.delete(`/appointment/${id}`, accessToken),
  });
};
