
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { getCurrentUserClient, type AuthenticatedUser } from "@/lib/auth-client";
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
    // This effect runs only on the client
    setUser(getCurrentUserClient());
    setLoading(false);
  }, [pathname]); // Re-check user on every navigation change

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login'; // Force a full page reload to clear state
  };

  if (loading) {
    if (mobile) {
      return (
         <div className="grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  if (user) {
    const dashboardUrl = user.role === 'admin' ? '/admin' : user.role === 'super-admin' ? '/super-admin' : '/dashboard';
    
    if (mobile) {
        return (
            <>
                <Link href={dashboardUrl} className="text-muted-foreground hover:text-foreground">Dashboard</Link>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
                <div className="pt-6">
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </>
        )
    }

    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href={dashboardUrl}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
         <Button variant="ghost" asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    );
  }

  if (mobile) {
      return (
         <div className="pt-6 grid gap-4">
            <Button asChild className="w-full">
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
                <Link href="/register">Sign Up</Link>
            </Button>
         </div>
      )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Sign up</Link>
      </Button>
    </div>
  );
}

