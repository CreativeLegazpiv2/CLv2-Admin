import { SidebarTrigger } from "@/components/ui/sidebar";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

export const Nav = () => {
  const currentDate = new Date();
  return (
    <div className="h-[10dvh]  top-0 z-50 w-full bg-neutral-200 text-slate-900 dark:bg-slate-600 dark:text-slate-300 group">
      <div className="flex h-full w-full relative">
        <SidebarTrigger className="absolute left-0 top-0 hover:bg-slate-900 hover:text-green-500 group-hover:translate-x-0 -translate-x-full opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 " />
        <div className="w-full h-full flex justify-between items-center max-w-[95%] mx-auto">
        <div className="flex gap-2 items-center">
        <CalendarDays size={24} />
        <div className="">{currentDate.toDateString()}</div>
        </div>
          
          <div className="w-fit flex gap-2 items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src="/images/boy.png"
                className="h-16 w-16 object-cover"
                alt=""
              />
            </div>
            <div className="flex flex-col ">
              <p className="text-sm">Creatives Admin</p>
              <p className="text-xs">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
