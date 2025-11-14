"use server";

import { auth } from "@/lib/auth";
import { executeActions } from "@/lib/execute-action";
import { apiClient } from "@/lib/request";
import { FetchPostWithCommentsResponse } from "../_types/schema";
import { CommentFormData } from "../_types/create-comment";

const fetchPostWithComment = async (id: string) => {
  const session = await auth();
  const accessToken = session?.accessToken;
  return await executeActions({
    actionFn: () =>
      apiClient.get<FetchPostWithCommentsResponse>(`/posts/${id}`, accessToken),
  });
};

const createComment = async (data: CommentFormData) => {
  const session = await auth();
  const accessToken = session?.accessToken;
  return await executeActions({
    actionFn: () =>
      apiClient.post(
        `/posts/${data.id}/comment`,
        {
          content: data.content,
        },
        accessToken
      ),
  });
};

const deleteComment = async (id: string) => {
  const session = await auth();
  const accessToken = session?.accessToken;
  return await executeActions({
    actionFn: () => apiClient.delete(`/comments/${id}`, accessToken),
  });
};

export { fetchPostWithComment, createComment, deleteComment };
