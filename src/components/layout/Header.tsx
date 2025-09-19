
"use client";

import Link from "next/link";
import { Gavel, Menu, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCurrentUserClient } from "@/lib/auth-client";
import { logout } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUserClient());
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: "/", label: "Auctions" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gavel className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-primary font-headline">
            NIBtera ጨረታ
          </span>
        </Link>
        <nav className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href={user.role === 'admin' ? '/admin' : user.role === 'super-admin' ? '/super-admin' : '/dashboard'}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Link>
              </Button>
               <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden ml-4">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    A list of links to navigate the site.
                  </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
