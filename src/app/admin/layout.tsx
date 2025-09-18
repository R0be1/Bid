
"use client";

import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Gavel, LayoutGrid, MessageSquare, Send, Tag, Trophy, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/users", label: "Users", icon: UserCog },
    { href: "/admin/results", label: "Results", icon: Trophy },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/communications", label: "Communications", icon: Send },
  ];

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <Gavel className="h-7 w-7 text-primary" />
                    <span className="font-bold text-xl text-foreground group-data-[collapsible=icon]:hidden">
                        BidCraft Admin
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
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
            <SidebarFooter>
               <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4 md:p-8">
            {children}
        </main>
    </SidebarProvider>
  );
}
