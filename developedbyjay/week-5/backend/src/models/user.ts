import { Role } from "@src/utils/types";
import bcrypt from "bcrypt";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  activities: Types.ObjectId[];
  meals: Types.ObjectId[];
  appointments: Types.ObjectId[];
  reports: Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
