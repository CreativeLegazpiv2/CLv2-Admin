import { AppSidebar } from "@/components/custom-ui/layout/AppSideBar";
import { Nav } from "@/components/custom-ui/layout/Nav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creatives Admin 2.0",
  description: "Creatives Admin Panel",
  icons: {
    icon: {
      url: "/logo/logo.png",
      type: "image/x-icon",
    },
  }
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
    <AppSidebar />
    <main className="w-full flex flex-col">
      <Nav />
      {/* <SidebarTrigger className="border border-black" /> */}
      <div className="w-full p-4">
      {children}
      </div>
    </main>
  </SidebarProvider>
  );
}
