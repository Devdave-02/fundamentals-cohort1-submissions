import { Document, model, Schema, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  authorSnapshot: {
    _id: Types.ObjectId;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true, maxlength: 2000 },
    authorSnapshot: {
      _id: { type: Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      displayName: { type: String },
      avatarUrl: { type: String },
    },
  },
  { timestamps: true }
);

// Compound index for fast paginated comment queries per post (newest first)
CommentSchema.index({ post: 1, createdAt: -1 });

export const Comment = model<IComment>("Comment", CommentSchema);
