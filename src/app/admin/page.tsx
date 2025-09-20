
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Users, Clock, Calendar, CheckCircle, Banknote } from "lucide-react";
import { redirect } from "next/navigation";
import { UserStatus } from "@prisma/client";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const auctioneerUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { auctioneerProfile: true }
  });

  if (!auctioneerUser || !auctioneerUser.auctioneerProfile) {
       return <div>Auctioneer profile not found.</div>;
  }

  const auctioneerProfileId = auctioneerUser.auctioneerProfile.id;
  const auctioneerName = auctioneerUser.auctioneerProfile.companyName;

  const auctionItems = await prisma.auctionItem.findMany({
      where: { auctioneerId: auctioneerProfileId }
  });
  
  const auctionItemIds = auctionItems.map(item => item.id);

  const bidsOnAuctioneerItems = await prisma.bid.findMany({
      where: {
          auctionItemId: {
              in: auctionItemIds
          }
      },
      select: {
          bidderId: true
      }
  });

  const distinctBidderIds = [...new Set(bidsOnAuctioneerItems.map(bid => bid.bidderId))];
  const activeBiddersCount = distinctBidderIds.length;

  const now = new Date();
  
  const totalItems = auctionItems.length;
  
  const activeAuctions = auctionItems.filter(item => new Date(item.startDate) <= now && new Date(item.endDate) > now).length;
  const upcomingAuctions = auctionItems.filter(item => new Date(item.startDate) > now).length;
  const endedAuctions = auctionItems.filter(item => new Date(item.endDate) <= now).length;
  
  // Calculate fees based only on the auctioneer's items.
  const totalParticipationFees = auctionItems.reduce((total, item) => total + (item.participationFee || 0), 0);
  const totalSecurityDeposits = auctionItems.reduce((total, item) => total + (item.securityDeposit || 0), 0);


  return (
    <div className="space-y-8 p-4 md:p-8">
       <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">An overview of your auction activity for <span className="font-semibold">{auctioneerName}</span>.</p>
        </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Auction Items
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              items you have created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Active Bidders
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBiddersCount}</div>
             <p className="text-xs text-muted-foreground">
              bidders in your auctions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Active Auctions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAuctions}</div>
             <p className="text-xs text-muted-foreground">
              your auctions currently running
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Upcoming Auctions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAuctions}</div>
             <p className="text-xs text-muted-foreground">
              your auctions scheduled to start
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Ended Auctions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endedAuctions}</div>
             <p className="text-xs text-muted-foreground">
              your auctions that have completed
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participation Fees
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipationFees.toLocaleString()} Birr</div>
             <p className="text-xs text-muted-foreground">
              from all your fee-based auctions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Security Deposits
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSecurityDeposits.toLocaleString()} Birr</div>
             <p className="text-xs text-muted-foreground">
              from all your deposit-based auctions
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
