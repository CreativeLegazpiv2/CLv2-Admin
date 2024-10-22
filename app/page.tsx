import { Login } from "@/components/auth/login";
import { Nav } from "@/components/layout/Nav";
import { SidebarHeader } from "@/components/ui/sidebar";

export default function Initial() {
  return (
    <main className="flex w-full h-dvh flex-col items-center justify-between">
      <div className="w-full h-full flex justify-center items-center">
        {/* By default login page lang muna, if may idagdag na design then add component nalang  */}
        <Login />
      </div>
    </main>
  );
}
