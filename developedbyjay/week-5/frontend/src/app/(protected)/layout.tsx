import { ReactNode } from "react";
import { DashboardLayout } from "./_components/dashboard-layout";

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
