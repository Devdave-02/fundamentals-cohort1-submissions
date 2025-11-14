import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReport extends Document {
  appointment: Types.ObjectId;
  user: Types.ObjectId;
  doctor: Types.ObjectId;
  reportType: string;
  content: string;
  createdAt: Date;
}
const ReportSchema = new Schema<IReport>({
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  reportType: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model<IReport>("Report", ReportSchema);
