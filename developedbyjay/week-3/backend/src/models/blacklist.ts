import { Document, model, Schema } from "mongoose";

export interface IBlacklistedToken extends Document {
  refreshToken: string;
  expiresAt: Date;
}
const blacklistSchema = new Schema<IBlacklistedToken>(
  {
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const Blacklist = model<IBlacklistedToken>("Blacklist", blacklistSchema);
export { Blacklist };
