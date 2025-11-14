import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  failedLoginAttempts: number;
  lockUntil?: Date;
  isLocked: boolean;
  passwordRefreshToken: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementFailedLogins(): Promise<void>;
  resetFailedLogins(): Promise<void>;
  lockAccount(): Promise<void>;
  unlockIfExpired(): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    passwordRefreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementFailedLogins = async function (): Promise<void> {
  this.failedLoginAttempts += 1;

  // Lock account after 3 failed attempts
  if (this.failedLoginAttempts >= 3) {
    this.lockUntil = new Date(
      process.env.LOCK_TIME || Date.now() + 30 * 60 * 1000
    );
  }

  await this.save({ validateBeforeSave: false });
};

userSchema.methods.resetFailedLogins = async function (): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.unlockIfExpired = async function (): Promise<boolean> {
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.resetFailedLogins();
    return true;
  }
  return false;
};

userSchema.virtual("isLocked").get(function (this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

export const User = mongoose.model<IUser>("User", userSchema);
