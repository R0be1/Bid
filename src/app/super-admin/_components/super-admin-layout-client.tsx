
"use client";

import { ReactNode } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Shield, LayoutGrid, Users, Settings, User, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from '@/app/actions';

export function SuperAdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/super-admin/manage-auctioneer", label: "Manage Auctioneer", icon: Users },
    { href: "/super-admin/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

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
                      <SidebarMenuButton asChild isActive={pathname === '/super-admin/profile'} tooltip="Profile">
                          <Link href="/super-admin/profile">
                              <User />
                              <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
               <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto bg-muted/40">
            {children}
        </main>
      </SidebarProvider>
  );
}

