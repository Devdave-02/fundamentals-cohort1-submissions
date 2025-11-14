import { Schema, model, Document, Types } from "mongoose";

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  name: string;
  specialty?: string;
  contact?: string;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialty: String,
  contact: String
}, { timestamps: true });

export default model<IDoctor>("Doctor", doctorSchema);
