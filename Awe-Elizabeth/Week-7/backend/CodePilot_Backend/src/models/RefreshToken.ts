import mongoose, { Schema } from "mongoose";

export interface IRefreshToken extends Document{
  _id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  tokenHash: string,           
  expiresAt: Date,           
  createdAt: Date,
  revoked: boolean  
}

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    expiresAt:{
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    revoked: {
        type: Boolean,
        required: true,
        default: false
    }
},
{ timestamps: true }
)

export default mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema)