
// types/postWithComments.ts

export interface AuthorSnapshot {
  _id: string;
  username: string;
  displayName: string;
}

export interface Post {
  _id: string;
  author: string;
  content: string;
  authorSnapshot: AuthorSnapshot;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Comment {
  _id: string;
  post: string; // references Post._id
  author: string;
  content: string;
  authorSnapshot: AuthorSnapshot;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PostWithCommentsData {
  post: Post;
  comments: Comment[];
  page: number;
  pageSize: number;
}

export interface FetchPostWithCommentsResponse {
  status: "success" | "error";
  message: string;
  data: PostWithCommentsData;
}
