

import { getAuctionItems } from "@/lib/data";
import { getUsers } from "@/lib/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Users, Clock, Calendar, CheckCircle, Banknote } from "lucide-react";


// MOCK: In a real app, this would come from the logged-in user's session
const MOCK_AUCTIONEER_NAME = "Vintage Treasures LLC";

export default function AdminPage() {
  const allAuctionItems = getAuctionItems();
  const users = getUsers();
  const now = new Date();
  
  // Filter items for the logged-in auctioneer
  const auctionItems = allAuctionItems.filter(item => item.auctioneerName === MOCK_AUCTIONEER_NAME);

  const totalItems = auctionItems.length;
  const activeBidders = users.filter(u => u.status === 'approved').length;
  
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
          <p className="text-muted-foreground">An overview of your auction activity for <span className="font-semibold">{MOCK_AUCTIONEER_NAME}</span>.</p>
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
              Total Active Bidders
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBidders}</div>
             <p className="text-xs text-muted-foreground">
              platform-wide approved users
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
