import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt'
import {UserRoles}  from "../utilities/enums/UserRole"


export interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt: Date
  isLocked: boolean;
  lockedTimeout?: Date | null;
  invalidTries: number
  tokenValidity: number
  refreshToken: string;
  comparePassword(userPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Invalid email format."
      ]
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
       match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    ]
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
     lastName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.User
    },
    profilePicture: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
     isLocked: {
      type: Boolean,
      default: false
    },  
    invalidTries: {
        type: Number,
        required: true,
        default: 0
    },
    lockedTimeout: {
        type: Date,
        default: null,
        required: false
    },
    tokenValidity:{
        type: Number,
        required: true
    },
    refreshToken:{
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

/**
 * Hash password before saving
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare raw password with hashed one
 */
UserSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
