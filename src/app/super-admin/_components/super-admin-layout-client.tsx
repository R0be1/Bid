"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Shield,
  LayoutGrid,
  Users,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/actions";

interface SuperAdminLayoutClientProps {
  children: ReactNode;
}

export function SuperAdminLayoutClient({
  children,
}: SuperAdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/super-admin/manage-auctioneer",
      label: "Manage Auctioneer",
      icon: Users,
    },
    { href: "/super-admin/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <SidebarProvider>
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="p-0">
          <div className="flex items-center gap-2 p-4">
            <Shield className="h-7 w-7 text-accent" />
            <span className="font-bold text-xl text-white group-data-[collapsible=icon]:hidden">
              NIBtera ጨረታ Super Admin
            </span>
          </div>
        </SidebarHeader>

        {/* Sidebar Navigation */}
        <SidebarContent className="p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/super-admin"}
                tooltip="Dashboard"
              >
                <Link href="/super-admin" className="flex items-center gap-2">
                  <LayoutGrid />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Dashboard
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/super-admin/profile"}
                tooltip="Profile"
              >
                <Link
                  href="/super-admin/profile"
                  className="flex items-center gap-2"
                >
                  <User />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Profile
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="flex items-center gap-2"
              >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/40">{children}</main>
    </SidebarProvider>
  );
}
