"use client";

import { ControlledTextArea } from "@/components/ui/controlled/controlled-textarea";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "../_services/use-post";
import {
  commentDefaultValue,
  CommentFormData,
  commentSchema,
} from "../_types/create-comment";

export function CreateComment({ postId }: { postId: string }) {
  const form = useForm<CommentFormData>({
    defaultValues: commentDefaultValue,
    resolver: zodResolver(commentSchema),
  });

  const commentMutation = useCreateComment();
  const onSubmit: SubmitHandler<CommentFormData> = (data: CommentFormData) => {
    const updatedData = {
      content: data.content,
      id: postId,
    };
    commentMutation.mutate(updatedData, {
      onSuccess: () => {
        form.reset(commentDefaultValue);
      },
    });
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center items-start gap-5 sm:gap-10">
          <ControlledTextArea<CommentFormData>
            name="content"
            placeholder="start writing here"
          />
          <Button
            isLoading={commentMutation.isPending}
            className="p-7 text-lg bg-gray-600"
            size="lg"
          >
            {" "}
            Create comment
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
