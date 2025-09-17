"use client";

import type { AuctionItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, DollarSign } from "lucide-react";

interface LiveBiddingProps {
  item: AuctionItem;
}

const bidders = ["BidMaster123", "ArtLover88", "CollectorPro", "AuctionHunter"];

export default function LiveBidding({ item }: LiveBiddingProps) {
  const [currentBid, setCurrentBid] = useState(item.currentBid ?? item.startingPrice);
  const [highBidder, setHighBidder] = useState(item.highBidder ?? "None");
  const [newBid, setNewBid] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const simulateBids = setInterval(() => {
      const bidIncrease = Math.floor(Math.random() * 100) + 10;
      setCurrentBid((prev) => prev + bidIncrease);
      setHighBidder(bidders[Math.floor(Math.random() * bidders.length)]);
    }, 5000 + Math.random() * 5000); // between 5-10 seconds

    return () => clearInterval(simulateBids);
  }, []);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bidAmount = parseFloat(newBid);
    if (!bidAmount || bidAmount <= currentBid) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be higher than the current bid of $${currentBid.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentBid(bidAmount);
    setHighBidder("You");
    setNewBid("");
    toast({
      title: "Bid Placed!",
      description: `You are now the highest bidder with $${bidAmount.toLocaleString()}.`,
    });
  };

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
              <span className="text-2xl font-bold text-primary">${currentBid.toLocaleString()}</span>
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
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder={`$${(currentBid + 1).toLocaleString()} or more`}
                  value={newBid}
                  onChange={(e) => setNewBid(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              Place Bid
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
