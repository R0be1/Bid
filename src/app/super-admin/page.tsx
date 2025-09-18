
"use client"

import { getAuctioneers } from "@/lib/auctioneers";
import { getAuctionItems } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Gavel } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function SuperAdminDashboard() {
  const auctioneers = getAuctioneers();
  const auctionItems = getAuctionItems();

  const totalAuctioneers = auctioneers.length;
  const activeAuctioneers = auctioneers.filter(a => a.status === 'active').length;
  const inactiveAuctioneers = auctioneers.filter(a => a.status === 'inactive').length;
  const totalBidItems = auctionItems.length;

  const auctioneerStatusData = [
    { name: 'Active', count: activeAuctioneers, fill: 'hsl(var(--primary))' },
    { name: 'Inactive', count: inactiveAuctioneers, fill: 'hsl(var(--destructive))' },
  ];
  
  const chartConfig = {
    count: {
      label: "Count",
    },
    Active: {
      label: "Active",
      color: "hsl(var(--primary))",
    },
    Inactive: {
      label: "Inactive",
      color: "hsl(var(--destructive))",
    },
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the auction platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <CardDescription>A visual breakdown of active vs. inactive auctioneers.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-[300px]">
            <PieChart>
                <Pie 
                    data={auctioneerStatusData} 
                    dataKey="count" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                >
                    {auctioneerStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
