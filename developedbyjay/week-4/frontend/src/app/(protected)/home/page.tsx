import { AllPosts } from "./_components/allPosts";
import { CreatePost } from "./_components/createPost";

export default function Page() {
  return (
    <div className="">
      <div className="pb-20">
        <CreatePost />
        <AllPosts />
      </div>
    </div>
  );
}
