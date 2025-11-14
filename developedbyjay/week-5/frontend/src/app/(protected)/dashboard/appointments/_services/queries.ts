'use server'
import { executeActions } from "@/lib/execute-action";
import { apiClient } from "@/lib/request";
import { DoctorsResponse } from "../_types/doctor-types";
import { AppointmentsResponse } from "../_types/appointment-types";
import { getAccessTokenFromHeaders } from "@/lib/auth";


export const getDoctors = async () => {
  const accessToken = await getAccessTokenFromHeaders();
  return await executeActions({
    actionFn: () => apiClient.get<DoctorsResponse>("/doctor", accessToken),
  });
};

export const getAppointments = async () => {
  const accessToken = await getAccessTokenFromHeaders();
  return await executeActions({
    actionFn: () => {
      return apiClient.get<AppointmentsResponse>("/appointment", accessToken);
    },
  });
};
