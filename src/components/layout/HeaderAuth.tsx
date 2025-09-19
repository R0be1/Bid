
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { getCurrentUserClient, type AuthenticatedUser } from "@/lib/auth-client";
import { logout } from "@/app/actions";
import { cn } from "@/lib/utils";

export function HeaderAuth() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUserClient());
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    // Force a full page reload to ensure all states are cleared
    window.location.href = '/login';
  };

  if (user) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Sign up</Link>
      </Button>
    </div>
  );
}


type NavItem = {
    href: string;
    label: string;
}
interface HeaderNavProps {
    navItems: NavItem[];
    className?: string;
    mobile?: boolean;
}

export function HeaderNav({ navItems, className, mobile = false }: HeaderNavProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUserClient());
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    window.location.href = '/login';
  };
  
  if (mobile) {
      return (
          <nav className={className}>
              {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-6">
                 {user ? (
                    <Button className="w-full" variant="outline" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  ) : (
                    <div className="grid gap-4">
                      <Button asChild className="w-full">
                        <Link href="/login">Log In</Link>
                      </Button>
                      <Button asChild className="w-full" variant="secondary">
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
          </nav>
      )
  }

  return (
    <nav className={className}>
      {navItems.map((item) => {
        if (!user && (item.href === '/dashboard' || item.href === '/profile')) {
            return null;
        }
        return (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {item.label}
            </Link>
        );
       })}
    </nav>
  );
}
