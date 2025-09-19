
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Gavel, LayoutGrid, MessageSquare, Send, Tag, Trophy, UserCog, User, LogOut } from "lucide-react";
import Link from "next/link";
import { getCurrentUserClient, type AuthenticatedUser } from "@/lib/auth";
import { logout } from "../actions";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUserClient();
    setUser(currentUser);
  }, []);
  
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/manage-items", label: "Manage Items", icon: Gavel },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/users", label: "Bidders", icon: UserCog },
    { href: "/admin/results", label: "Results", icon: Trophy },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/communications", label: "Communications", icon: Send },
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
                    <Gavel className="h-7 w-7 text-primary" />
                    <span className="font-bold text-lg text-white group-data-[collapsible=icon]:hidden">
                        {user?.name || "Auctioneer"}
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))} tooltip={item.label}>
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
                      <SidebarMenuButton asChild isActive={pathname === '/admin/profile'} tooltip="Profile">
                          <Link href="/admin/profile">
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
