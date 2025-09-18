

"use client";

import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Shield, LayoutGrid, Users, Settings, Home, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/super-admin/manage-auctioneer", label: "Manage Auctioneer", icon: Users },
    { href: "/super-admin/settings", label: "Settings", icon: Settings },
  ];

  return (
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="p-0">
                <div className="flex items-center gap-2 p-4">
                    <Shield className="h-7 w-7 text-accent" />
                    <span className="font-bold text-xl text-white group-data-[collapsible=icon]:hidden">
                        NIBtera ጨረታ Super Admin
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/super-admin'} tooltip="Dashboard">
                            <Link href="/super-admin">
                                <LayoutGrid />
                                <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
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
                      <SidebarMenuButton asChild tooltip="Profile">
                          <Link href="/super-admin/manage-auctioneer">
                              <User />
                              <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Logout">
                          <Link href="/login">
                              <LogOut />
                              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
               <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </main>
      </SidebarProvider>
  );
}
