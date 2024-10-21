'use client'

import { Button } from "@/components/ui/button"
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
  } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { Calendar, HelpCircle, Home, Inbox, Search, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
  
export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-slate-900">
      <SidebarHeader className=" px-6 py-4 flex justify-center items-center bg-slate-900">
      <div className="h-[8vh] w-fit">
            <img src="/logo/create.png" className="w-fit h-full object-cover" alt="" />
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
                  'flex w-full items-center gap-3 rounded-lg p-4 transition-colors hover:bg-muted',
                  pathname === item.url
                    ? 'bg-primary text-stone-300 hover:bg-primary/90'
                    : 'text-stone-300 hover:text-foreground'
                )}
              >
                <Link href={item.url} >
                  <item.icon />
                  <span className="text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className=" p-4 bg-slate-900">
        <Button variant="outline" className="w-full justify-start gap-2">
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
  

  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
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
  ]
   