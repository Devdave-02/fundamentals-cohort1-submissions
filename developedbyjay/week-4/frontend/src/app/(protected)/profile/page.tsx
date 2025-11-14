import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();
  if (!session) return null;

    return <div className="flex justify-between">
      Big man joshua
  </div>;
};

export default Page;
