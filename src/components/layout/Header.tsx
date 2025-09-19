
"use client";

import Link from "next/link";
import { Gavel, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderAuth, HeaderNav } from "./HeaderAuth";

export function Header() {
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
        
        <HeaderNav navItems={navItems} className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium" />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <HeaderAuth />
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
               <HeaderNav navItems={navItems} className="grid gap-6 text-lg font-medium mt-8" mobile={true}/>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
