
import Link from "next/link";
import { Gavel, Menu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const navItems = [
    { href: "/", label: "Auctions" },
    { href: "/admin", label: "Admin" },
    { href: "/dashboard", label: "Dashboard" },
  ];
  
  // Mock login status
  const isLoggedIn = true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gavel className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-primary font-headline">
            BidCraft
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
          {isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Link>
              </Button>
               <Button variant="outline">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                <Link href="/register">Sign up</Link>
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
