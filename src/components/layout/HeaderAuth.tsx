
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Gavel,
  History,
} from "lucide-react";
import {
  getCurrentUserClient,
} from "@/lib/auth-client";
import type { AuthenticatedUser } from "@/lib/auth";
import { logout } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";

interface HeaderAuthProps {
  mobile?: boolean;
}

export function HeaderAuth({ mobile = false }: HeaderAuthProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUserClient();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  // ---------------- Loading state ----------------
  if (loading) {
    if (mobile) {
      return (
        <div className="grid gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  // ---------------- Logged-in state ----------------
  if (user) {
    const dashboardUrl =
      user.role === "admin"
        ? "/admin"
        : user.role === "super-admin"
        ? "/super-admin"
        : "/dashboard";

    const navLinks = [
        { href: "/", label: "Auctions", icon: Gavel, role: ['user', 'admin', 'super-admin'] },
        { href: dashboardUrl, label: "Dashboard", icon: LayoutDashboard, role: ['user', 'admin', 'super-admin'] },
        { href: "/history", label: "Bidding History", icon: History, role: ['user'] },
        { href: "/profile", label: "Profile", icon: UserIcon, role: ['user', 'admin', 'super-admin'] },
    ].filter(link => link.role.includes(user.role));


    if (mobile) {
      return (
        <>
          {navLinks.map(link => (
             <Link
                key={link.href}
                href={link.href}
                className={`text-muted-foreground hover:text-foreground ${pathname === link.href ? 'font-semibold text-primary' : ''}`}
            >
                {link.label}
            </Link>
          ))}
          <div className="pt-6">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        {navLinks.map(link => (
             <Button key={link.href} variant={pathname === link.href ? 'secondary' : 'ghost'} asChild>
                <Link href={link.href}>
                    <link.icon className="mr-2" />
                    {link.label}
                </Link>
            </Button>
        ))}
        <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="mr-2" />
          Log out
        </Button>
      </div>
    );
  }

  // ---------------- Logged-out state ----------------
  if (mobile) {
    return (
      <div className="pt-6 grid gap-4">
        <Button asChild className="w-full">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild variant="accent" className="w-full">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild variant="accent">
        <Link href="/register">Sign up</Link>
      </Button>
    </div>
  );
}
