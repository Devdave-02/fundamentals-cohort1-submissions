import { Document, model, Schema, Types } from "mongoose";
export interface IPost {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  authorSnapshot: {
    _id: Types.ObjectId;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  commentCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true, maxlength: 5000 },
    authorSnapshot: {
      _id: { type: Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      displayName: { type: String },
      avatarUrl: { type: String },
    },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for serving feeds (newest posts)
PostSchema.index({ createdAt: -1 });
// Index to find posts by author quickly
PostSchema.index({ author: 1, createdAt: -1 });

export const Post = model<IPost>("Post", PostSchema);
