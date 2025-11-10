import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: any;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
