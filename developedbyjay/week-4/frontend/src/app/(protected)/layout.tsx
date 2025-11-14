import { ReactNode } from "react";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <div className="w-full h-screen container  mx-auto  px-4">{children}</div>
  );
};

export default Layout;
