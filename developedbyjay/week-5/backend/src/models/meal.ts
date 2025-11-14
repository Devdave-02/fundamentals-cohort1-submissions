import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeal extends Document {
  user: Types.ObjectId;
  name: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
  date: Date;
}

const MealSchema = new Schema<IMeal>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  nutrients: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  date: { type: Date, default: Date.now },
});

export const Meal = mongoose.model<IMeal>("Meal", MealSchema);
