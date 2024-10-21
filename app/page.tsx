import { Login } from "@/components/auth/login";
import { Nav } from "@/components/custom-ui/layout/Nav";
import { SidebarHeader } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <main className="flex w-full h-dvh flex-col items-center justify-between">
      <SidebarHeader />
      <div className="w-full h-full flex justify-center items-center">
        <Login />
      </div>
    </main>
  );
}
