import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  fetchPostWithComment,
} from "./post-service";
import { toast } from "sonner";
import { CommentFormData } from "../_types/create-comment";

const useFetchPostWithComment = (selectedPostId: string) => {
  return useQuery({
    queryKey: ["posts", { selectedPostId }],
    queryFn: () => fetchPostWithComment(selectedPostId),
    enabled: !!selectedPostId,
  });
};

const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CommentFormData) => {
      await createComment(data);
    },
    onSuccess: () => {
      toast.success("comment created successfully");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

const useDeleteComment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await deleteComment(id);
    },
    onSuccess: () => {
      toast.success("comment deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};
export { useFetchPostWithComment, useCreateComment, useDeleteComment };
