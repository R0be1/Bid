
"use client";

import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { CircleUser, Gavel, LayoutGrid, Tag, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/users", label: "Users", icon: CircleUser },
    { href: "/admin/results", label: "Results", icon: Trophy },
  ];

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Gavel className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg text-primary font-headline">
                        BidCraft Admin
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
             <div className="p-4 md:p-8">
                <div className="md:hidden mb-4">
                    <SidebarTrigger />
                </div>
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
