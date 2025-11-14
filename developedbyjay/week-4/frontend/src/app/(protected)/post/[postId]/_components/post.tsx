"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatTwitterTimestamp } from "@/lib/utils";
import { useFetchPostWithComment } from "../_services/use-post";
import { AllComments } from "./allComments";
import { CreateComment } from "./createComment";

export function PostDetails({ postId }: { postId: string }) {
  const { data } = useFetchPostWithComment(postId);

  if (!data) return <>loading</>;

  return (
    <>
      <Card className="w-full mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <span>{data.data.post.authorSnapshot.displayName}</span>
            <span className="font-normal text-sm">
              @{data.data.post.authorSnapshot.username}•
            </span>
            <span className="font-normal text-sm">
              {formatTwitterTimestamp(data.data.post.createdAt)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>{data.data.post.content}</CardContent>
      </Card>
      {/* Add Comment */}

      <CreateComment postId={postId} />
      <div className="pb-10">
        {data.data.comments &&
          data.data.comments.map((data) => {
            return <AllComments key={data._id} data={data} />;
          })}
      </div>
    </>
  );
}
