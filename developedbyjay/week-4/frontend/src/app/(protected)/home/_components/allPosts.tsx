"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useDeletePost, useFetchPosts } from "../_services/use-post";
import { formatTwitterTimestamp } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Post } from "../../post/[postId]/_types/schema";

export function AllPosts() {
  const { data } = useFetchPosts();
  const { data: session } = useSession();

  return data?.data.posts.map((post) => {
    return <PostItem key={post._id} post={post} session={session} />;
  });
}

function PostItem({ post, session }: { post: Post; session: any }) {
  const deletePost = useDeletePost(post._id);

  return (
    <Link href={`/post/${post._id}`}>
      <Card className="w-full mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <span>{post.authorSnapshot.displayName}</span>
            <span className="font-normal text-sm">
              @{post.authorSnapshot.username}•
            </span>
            <span className="font-normal text-sm">
              {formatTwitterTimestamp(post.createdAt)}
            </span>
            <span className="font-bold text-sm ml-auto">
              comment count : {post.commentCount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>{post.content}</span>
          {session?.user.id === post.author && (
            <CardAction>
              <Button
                isLoading={deletePost.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  deletePost.mutate();
                }}
              >
                Delete post
              </Button>
            </CardAction>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
