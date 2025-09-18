

import { getAuctionItems } from "@/lib/data";
import { getUsers } from "@/lib/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Users, Clock, Calendar, CheckCircle } from "lucide-react";


export default function AdminPage() {
  const auctionItems = getAuctionItems();
  const users = getUsers();
  const now = new Date();

  const totalItems = auctionItems.length;
  const activeBidders = users.filter(u => u.status === 'approved').length;
  
  const activeAuctions = auctionItems.filter(item => new Date(item.startDate) <= now && new Date(item.endDate) > now).length;
  const upcomingAuctions = auctionItems.filter(item => new Date(item.startDate) > now).length;
  const endedAuctions = auctionItems.filter(item => new Date(item.endDate) <= now).length;


  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">An overview of your auction activity.</p>
        </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Auction Items
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              items created across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bidders
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBidders}</div>
             <p className="text-xs text-muted-foreground">
              users approved to place bids
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Auctions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAuctions}</div>
             <p className="text-xs text-muted-foreground">
              auctions currently in progress
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Auctions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAuctions}</div>
             <p className="text-xs text-muted-foreground">
              auctions scheduled to start
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ended Auctions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endedAuctions}</div>
             <p className="text-xs text-muted-foreground">
              auctions that have completed
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
