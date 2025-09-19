
"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-body antialiased flex flex-col min-h-screen bg-background text-foreground`}
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
