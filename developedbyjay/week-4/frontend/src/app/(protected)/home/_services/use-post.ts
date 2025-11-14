import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostFormData } from "../_types/create-post";
import { createPost, deletePost, fetchPosts } from "./post-service";
import { toast } from "sonner";

const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostFormData) => {
      await createPost(data);
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};

const useDeletePost = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await deletePost(id);
    },
    onSuccess: () => {
      toast.success("post deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

export { useCreatePost, useFetchPosts, useDeletePost };
