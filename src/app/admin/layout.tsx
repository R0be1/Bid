

"use client";

import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Gavel, LayoutGrid, MessageSquare, Send, Tag, Trophy, UserCog, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuctioneerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/manage-items", label: "Manage Items", icon: Gavel },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/users", label: "Users", icon: UserCog },
    { href: "/admin/results", label: "Results", icon: Trophy },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/communications", label: "Communications", icon: Send },
  ];

  return (
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="p-0">
                <div className="flex items-center gap-2 p-4">
                    <Gavel className="h-7 w-7 text-primary" />
                    <span className="font-bold text-xl text-white group-data-[collapsible=icon]:hidden">
                        NIBtera ጨረታ Admin
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-0">
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Customer Portal">
                          <Link href="/">
                              <Home />
                              <span className="group-data-[collapsible=icon]:hidden">Customer Portal</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
               <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
        </main>
      </SidebarProvider>
  );
}
