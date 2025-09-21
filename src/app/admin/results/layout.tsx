
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";


export default function ResultsLayout({ children }: { children: ReactNode}) {
    const pathname = usePathname();
    const isMainResultsPage = pathname === '/admin/results';

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex items-center gap-4">
                {!isMainResultsPage && (
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/results">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to Results</span>
                        </Link>
                    </Button>
                )}
                <div>
                    <h1 className="text-3xl font-bold font-headline text-primary">Auction Results</h1>
                    <p className="text-muted-foreground">View results for your completed auctions.</p>
                </div>
            </div>
            {children}
        </div>
    )
}
