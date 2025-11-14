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

export interface PostsData {
  posts: Post[];
  page: number;
  pageSize: number;
}

export interface FetchPostsResponse {
  status: "success" | "error";
  message: string;
  data: PostsData;
}
