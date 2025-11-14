"use server";

import { executeActions } from "@/lib/execute-action";
import { PostFormData } from "../_types/create-post";
import { apiClient } from "@/lib/request";
import { auth } from "@/lib/auth";
import { FetchPostsResponse } from "../_types/fetch-posts";

const createPost = async (data: PostFormData) => {
  const session = await auth();
  const accessToken = session?.accessToken;
  return await executeActions({
    actionFn: () =>
      apiClient.post(
        "/posts",
        {
          content: data.content,
        },
        accessToken
      ),
  });
};

const fetchPosts = async () => {
  const session = await auth();
  const accessToken = session?.accessToken;
  return await executeActions({
    actionFn: () => apiClient.get<FetchPostsResponse>("/posts", accessToken),
  });
};

const deletePost = async (id: string) => {
  const session = await auth();
  const accessToken = session?.accessToken;
  return await executeActions({
    actionFn: () => apiClient.delete(`/posts/${id}`, accessToken),
  });
};
export { createPost, fetchPosts,deletePost };
