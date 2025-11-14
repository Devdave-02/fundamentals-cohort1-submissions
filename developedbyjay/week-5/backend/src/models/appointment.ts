import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  userId: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  reason: string;
  reports: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
  },
  {
    timestamps: true,
  }
);

AppointmentSchema.index({ createdAt: -1 });
export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
);
