"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, ChevronsLeft, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "../_services/use-query";

type DashboardLayoutProps = {
  children: ReactNode;
};

type RouteType = {
  href: string;
  label: string;
  icon: ReactNode;
  type: "user" | "admin";
}[];

const ROUTE_GROUPS: RouteType = [
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: <Calendar className="size-5" />,
    type: "user",
  },
  {
    href: "/dashboard/activity",
    label: "Activity",
    icon: <Activity className="size-5" />,
    type: "user",
  },
  {
    href: "/dashboard/doctor",
    label: "Doctor",
    icon: <Users className="size-5" />,
    type: "admin",
  },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const user = useUser();

  const userRole = user.data?.data.user.role;
  console.log(userRole)

  const filteredRoutes = ROUTE_GROUPS.filter((route) => {
    return route.type === userRole;
  });

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between h-20 bg-gray-50">
        <h2 className="font-medium text-lg uppercase leading-2 text-gray-600 ml-6">
          Pulse Track
        </h2>
        <div className="hidden md:flex items-center gap-2 p-2 pr-3 hover:bg-gray-100 border rounded-full mr-6">
          <User />
          {!user.isPending && (
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.data?.data.user.name}</p>
              <p className="text-sm">{user.data?.data.user.email}</p>
            </div>
          )}
        </div>
      </header>
      {/* Main */}
      <main className="flex">
        <div
          className={`bg-gray-100 p-4 min-h-screen transition-all duration-300 ease-in-out ${
            open ? "w-64" : "w-24"
          }`}
        >
          <div
            className={`border-2 rounded-2xl relative h-fit transition-all duration-300 ease-in-out ${
              open ? "w-full p-5" : "w-fit p-2"
            }`}
          >
            {/* Chevron Icon */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute bg-gray-100 border-2 rounded-full top-0 right-[-14px] cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <ChevronsLeft
                className={`size-4 transition-transform duration-300 ease-in-out ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Route Group */}

            <div className="flex flex-col gap-2">
              {filteredRoutes.map((item) => {
                return (
                  <Button
                    className={`hover:bg-gray-200 font-normal transition-all duration-300 ease-in-out ${
                      open ? "w-full" : "w-fit"
                    }`}
                    variant="ghost"
                    asChild
                    key={item.label}
                  >
                    <Link
                      href={item.href}
                      className={`flex justify-start  ${
                        pathname === item.href
                          ? "bg-foreground/10 hover:bg-foreground/5"
                          : "hover:bg-foreground/10"
                      }`}
                    >
                      {item.icon}
                      {open && (
                        <span className="text-[15px] font-semibold transition-all duration-300 ease-in-out">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-5 flex-1 w-full max-w-[1200px] mt-5 md:mt-10 mx-auto items-center justify-center ">
          {children}
        </div>
      </main>
    </>
  );
};
