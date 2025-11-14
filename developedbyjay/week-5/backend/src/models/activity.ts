import mongoose, { Schema, Document, Types } from "mongoose";

export interface IActivity extends Document {
  userId: Types.ObjectId;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  createdAt: Date;
  updatedAt: Date;
}
const ActivitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
  },
  {
    timestamps: true,
    
  }
);
ActivitySchema.index({ createdAt: -1 });
export const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
