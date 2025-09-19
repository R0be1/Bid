
"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPortalPage = pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth");

  const showHeader = !isPortalPage && !isAuthPage;

  return (
    <html lang="en" className="h-full">
      <head>
      </head>
      <body
        className={`font-body antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        {showHeader && <Header />}
        <div className={`flex-grow ${showHeader ? 'container mx-auto px-4 sm:px-6 lg:px-8 py-8' : isPortalPage || isAuthPage ? 'flex' : ''}`}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
