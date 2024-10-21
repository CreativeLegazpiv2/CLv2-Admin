import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export const Nav = () => {
    const currentDate = new Date();
  return (
    <div className="h-[10dvh]  top-0 z-[100] w-full bg-neutral-200 text-slate-900 dark:bg-slate-600 dark:text-slate-300 ">
      <div className="flex h-full w-full relative">
        <SidebarTrigger className="absolute left-0 top-0 hover:bg-slate-900 hover:text-green-500" />
        <div className="w-full h-full flex justify-between items-center max-w-[90%] mx-auto">
          
          <div className="">{currentDate.toDateString()}</div>
          asdasd
          <div className="w-fit">
            <div className="h-16 w-16 rounded-full overflow-hidden">
                <img src="/images/boy.png" className="h-16 w-16 object-cover" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
