"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/login/logout";
import { Dialog } from "@radix-ui/react-dialog";

import {
  Calendar,
  HelpCircle,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export function AppSidebar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const router = useRouter();
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    router.push('/');
    toast.success("Logged out successfully!", {
      position: "bottom-right",
      autoClose: 5000,
    });
  };

  return (
      <Sidebar className="z-[100]">
      <SidebarHeader className=" px-6 py-4 flex justify-center items-center bg-slate-900">
        <div className="h-[8vh] w-fit">
          <img
            src="/logo/create.png"
            className="w-fit h-full object-cover"
            alt=""
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 bg-slate-900">
        <SidebarMenu className="flex flex-col gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-4 transition-colors hover:bg-muted",
                  pathname === item.url
                    ? "bg-primary text-stone-300 hover:bg-primary/90"
                    : "text-stone-300 hover:text-foreground"
                )}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span className="text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className=" p-4 bg-slate-900">
        <Button
           onClick={handleLogout}
          variant="outline"
          className="w-full justify-center gap-2 font-bold"
        >
          <LogOut size={32} />
          Logout
        </Button>
      </SidebarFooter>
      <ToastContainer/>
    </Sidebar>
  );
}

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Users",
    url: "/creative-users",
    icon: Inbox,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
