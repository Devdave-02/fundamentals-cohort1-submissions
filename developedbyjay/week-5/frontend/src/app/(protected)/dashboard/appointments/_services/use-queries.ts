import { useQuery } from "@tanstack/react-query";
import { getAppointments, getDoctors } from "./queries";

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });
};

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
  });
};