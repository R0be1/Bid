
"use client";

import Link from "next/link";
import { Gavel, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderAuth } from "./HeaderAuth";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gavel className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-primary font-headline">
            NIBtera ጨረታ
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden md:flex">
             <HeaderAuth />
          </div>
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
               <div className="grid gap-6 text-lg font-medium mt-8">
                 <Link href="/" className="text-muted-foreground hover:text-foreground">Auctions</Link>
                 <HeaderAuth mobile={true} />
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
