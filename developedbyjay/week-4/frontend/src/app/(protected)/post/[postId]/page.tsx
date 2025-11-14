import { PostDetails } from "./_components/post";

export default async function Page({ params }: { params: { postId: string } }) {
  const { postId } = await params;
  return (
    <div>
      <PostDetails postId={postId} />
    </div>
  );
}
