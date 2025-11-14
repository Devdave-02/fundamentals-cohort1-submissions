import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  contactInfo: string;
  appointments: Types.ObjectId[];
}

const DoctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  contactInfo: { type: String, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
});

export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);
