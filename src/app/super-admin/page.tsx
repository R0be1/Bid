// app/super-admin/page.tsx
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Gavel } from "lucide-react";
import { UserStatus } from "@prisma/client";
import AuctioneerChart from "./_components/AuctioneerChart";

export default async function SuperAdminDashboard() {
  // Server-side Prisma queries
  const totalAuctioneers = await prisma.user.count({
    where: {
      roles: { some: { name: "AUCTIONEER" } },
    },
  });

  const activeAuctioneers = await prisma.user.count({
    where: {
      status: UserStatus.APPROVED,
      roles: { some: { name: "AUCTIONEER" } },
    },
  });

  const inactiveAuctioneers = await prisma.user.count({
    where: {
      status: { not: UserStatus.APPROVED },
      roles: { some: { name: "AUCTIONEER" } },
    },
  });

  const totalBidItems = await prisma.auctionItem.count();

  const auctioneerStatusData = [
    { name: "Active", count: activeAuctioneers, fill: "hsl(var(--accent))" },
    {
      name: "Inactive",
      count: inactiveAuctioneers,
      fill: "hsl(var(--destructive))",
    },
  ];

  const chartConfig = {
    count: { label: "Count" },
    Active: { label: "Active", color: "hsl(var(--accent))" },
    Inactive: { label: "Inactive", color: "hsl(var(--destructive))" },
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of the auction platform.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Auctioneers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuctioneers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Auction Items
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBidItems}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auctioneer Status</CardTitle>
          <CardDescription>
            A visual breakdown of active vs. inactive auctioneers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <AuctioneerChart
            data={auctioneerStatusData}
            chartConfig={chartConfig}
          />
        </CardContent>
      </Card>
    </div>
  );
}
