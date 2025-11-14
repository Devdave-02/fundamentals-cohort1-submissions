"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTwitterTimestamp } from "@/lib/utils";
import { Comment } from "../_types/schema";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useDeleteComment } from "../_services/use-post";

export function AllComments({ data }: { data: Comment }) {
  const { data: session } = useSession();

  const deleteComment = useDeleteComment(data._id);

  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <span>{data.authorSnapshot.displayName}</span>
          <span className="font-normal text-sm">
            @{data.authorSnapshot.username}•
          </span>
          <span className="font-normal text-sm">
            {formatTwitterTimestamp(data.createdAt)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span>{data.content}</span>
        {session?.user.id === data.author && (
          <CardAction>
            <Button
              isLoading={deleteComment.isPending}
              onClick={() => deleteComment.mutate()}
            >
              Delete comment
            </Button>
          </CardAction>
        )}
      </CardContent>
    </Card>
  );
}
