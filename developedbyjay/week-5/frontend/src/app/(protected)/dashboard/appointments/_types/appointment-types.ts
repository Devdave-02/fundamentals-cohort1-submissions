import { z } from "zod";

export const appointmentSchema = z.object({
  _id: z.string().optional(), 
  doctorId: z
    .string("Doctor is important")
    .min(4, { message: "Select a doctor" }),
  date: z.date(),
  reason: z
    .string("A definite reason is required")
    .min(2, { message: "Reason must not be empty" }),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const appointmentDefaultValues: AppointmentSchema = {
  doctorId: "",
  date: new Date(),
  reason: "",
};

// Represents the doctor object embedded in an appointment
export interface DoctorRef {
  _id: string;
  name: string;
}

// Represents a single appointment
export interface Appointment {
  _id: string;
  userId: string;
  doctorId: DoctorRef;
  date: string;
  reason: string;
  reports: [];
  __v: number;
}

export interface AppointmentsResponse {
  status: "success" | "error";
  message: string;
  data: Appointment[];
}
