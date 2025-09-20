
"use client";

import type { AuctionItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { getCurrentUserClient, type AuthenticatedUser } from "@/lib/auth-client";

interface LiveBiddingProps {
  item: AuctionItem;
}

const bidders = ["BidMaster123", "ArtLover88", "CollectorPro", "AuctionHunter"];

export default function LiveBidding({ item }: LiveBiddingProps) {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null | undefined>(undefined);
  const [currentBid, setCurrentBid] = useState(item.currentBid ?? item.startingPrice);
  const [highBidder, setHighBidder] = useState(item.highBidder ?? "None");
  const [newBid, setNewBid] = useState("");
  const { toast } = useToast();
  const minIncrement = item.minIncrement ?? 1;

  useEffect(() => {
    getCurrentUserClient().then(setCurrentUser);
  }, []);
  
  const requiresFees = (item.participationFee && item.participationFee > 0) || (item.securityDeposit && item.securityDeposit > 0);
  const hasPaid = (item.participationFee && item.participationFee > 0 ? currentUser?.paidParticipation : true) && (item.securityDeposit && item.securityDeposit > 0 ? currentUser?.paidDeposit : true);

  useEffect(() => {
    // In a real app with a real-time database like Firestore,
    // you wouldn't need to simulate bids like this.
    const simulateBids = setInterval(() => {
      if (new Date() > new Date(item.endDate)) {
        clearInterval(simulateBids);
        return;
      }
      const bidIncrease = minIncrement + Math.floor(Math.random() * 10) * minIncrement;
      setCurrentBid((prev) => prev + bidIncrease);
      setHighBidder(bidders[Math.floor(Math.random() * bidders.length)]);
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(simulateBids);
  }, [minIncrement, item.endDate]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
        toast({ title: "Login Required", description: "You must be logged in to place a bid.", variant: "destructive"});
        return;
    }
    if (requiresFees && !hasPaid) {
      toast({ title: "Payment Required", description: "Please complete the required payments from your dashboard to participate.", variant: "destructive"});
      return;
    }
    if (currentUser.status !== 'APPROVED') {
        toast({ title: "Account Not Approved", description: `Your account status is "${currentUser.status}". Admin approval is required to bid.`, variant: "destructive"});
        return;
    }

    const bidAmount = parseFloat(newBid);
    const requiredBid = currentBid + minIncrement;
    
    if (!bidAmount || bidAmount < requiredBid) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be at least ${requiredBid.toLocaleString()} Birr. (Minimum increment: ${minIncrement.toLocaleString()} Birr)`,
        variant: "destructive",
      });
      return;
    }
    setCurrentBid(bidAmount);
    setHighBidder("You");
    setNewBid("");
    toast({
      title: "Bid Placed!",
      description: `You are now the highest bidder with ${bidAmount.toLocaleString()} Birr.`,
    });
  };
  
  if (currentUser === undefined) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Live Bidding</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }

  if (!currentUser) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Join the Auction</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Registration Required</AlertTitle>
                <AlertDescription>
                   You need to be logged in to participate in this auction. Please register or log in to continue.
                    <Button asChild className="w-full mt-4">
                        <Link href="/register">Register or Log In</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (requiresFees && !hasPaid) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Special Auction Requirements</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Payment Required</AlertTitle>
                <AlertDescription>
                    This auction requires payment of fees. Please visit your dashboard to complete the payment.
                    <Button asChild className="w-full mt-4">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Live Bidding</CardTitle>
        <CardDescription>Place your bid to win this item!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Current Bid</span>
              <span className="text-2xl font-bold text-primary">{currentBid.toLocaleString()} Birr</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">High Bidder</span>
              <span className={`font-semibold ${highBidder === 'You' ? 'text-accent' : ''}`}>{highBidder}</span>
            </div>
          </div>
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bidAmount" className="sr-only">Bid Amount</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-muted-foreground">Birr</span>
                </div>
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder={`${(currentBid + minIncrement).toLocaleString()} or more`}
                  value={newBid}
                  onChange={(e) => setNewBid(e.target.value)}
                  className="pl-10"
                  required
                  step={minIncrement}
                  disabled={currentUser.status !== 'APPROVED'}
                />
              </div>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={currentUser.status !== 'APPROVED'}>
              Place Bid
            </Button>
          </form>
           {currentUser.status !== 'APPROVED' ? (
             <p className="text-xs text-center text-red-600">
                Your account is not approved to bid. Please contact an administrator.
            </p>
            ) : (
            <p className="text-xs text-center text-muted-foreground">
              Minimum bid increment: {minIncrement.toLocaleString()} Birr
            </p>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
