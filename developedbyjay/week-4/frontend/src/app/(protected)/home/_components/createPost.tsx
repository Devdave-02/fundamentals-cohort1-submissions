"use client";

import { ControlledTextArea } from "@/components/ui/controlled/controlled-textarea";
import {
  postDefaultValues,
  PostFormData,
  postSchema,
} from "../_types/create-post";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "../_services/use-post";

export function CreatePost() {
  const form = useForm<PostFormData>({
    defaultValues: postDefaultValues,
    resolver: zodResolver(postSchema),
  });

  const postMutation = useCreatePost();
  const onSubmit: SubmitHandler<PostFormData> = (data: PostFormData) => {
    postMutation.mutate(data, {
      onSuccess: () => {
        form.reset(postDefaultValues);
      }
    });
    
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center items-start gap-5 sm:gap-10">
          <ControlledTextArea<PostFormData>
            name="content"
            placeholder="start writing here"
          />
          <Button
            isLoading={postMutation.isPending}
            className="p-7 text-lg bg-gray-600"
            size="lg"
          >
            {" "}
            Create Post
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
