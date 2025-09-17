
"use client";

import { getAuctionItem, getAuctionBids } from "@/lib/data";
import { notFound } from "next/navigation";
import { useState } from "react";
import type { MessageTemplate, Bid, AuctionItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Trophy, Users, BarChart2, Megaphone, Send } from "lucide-react";
import { AnnounceResultsForm, type Announcement } from "./_components/announce-results-form";
import { AnnouncementHistory } from "./_components/announcement-history";
import { getMessageTemplates } from "@/lib/messages";

export default function AuctionResultsPage({ params }: { params: { id: string } }) {
  const item = getAuctionItem(params.id);
  
  if (!item) {
    notFound();
  }
  
  const bids = getAuctionBids(params.id);
  const auctionEnded = new Date() >= new Date(item.endDate);
  const winners = bids.slice(0, 10);
  const participantCount = new Set(bids.map(b => b.bidderName)).size;
  const messageTemplates = getMessageTemplates();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const handleAddAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => [announcement, ...prev]);
  };

  const bidCounts = bids.reduce((acc, bid) => {
      const priceRange = Math.floor(bid.amount / 100) * 100;
      const rangeLabel = `$${priceRange} - $${priceRange + 99}`;
      acc[rangeLabel] = (acc[rangeLabel] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  if (!auctionEnded) {
    return (
        <div className="max-w-4xl mx-auto py-8 text-center">
            <Card>
                <CardHeader>
                    <CardTitle>Auction Still in Progress</CardTitle>
                    <CardDescription>
                        The results will be available once the auction ends on {format(new Date(item.endDate), "PPP p")}.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Auction Results</h1>
            <p className="text-lg text-muted-foreground">{item.name}</p>
        </div>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="text-accent" />
            Announce Results
          </CardTitle>
          <CardDescription>
            Notify the top bidders about the auction outcome using a message template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnounceResultsForm templates={messageTemplates} bids={bids} item={item} onAnnouncementSent={handleAddAnnouncement} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="text-accent" />
            Announcement History
          </CardTitle>
          <CardDescription>A log of all announcements sent for this auction.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementHistory announcements={announcements} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-accent" />
            Winners List
          </CardTitle>
          <CardDescription>
            Top 10 bids for this auction. The highest bidder is the winner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Bidder</TableHead>
                <TableHead className="text-right">Bid Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners.length > 0 ? winners.map((bid, index) => (
                <TableRow key={index} className={index === 0 ? "bg-accent/10" : ""}>
                  <TableCell className="font-bold">
                    {index === 0 ? <Trophy className="h-5 w-5 text-yellow-500" /> : `#${index + 1}`}
                  </TableCell>
                  <TableCell>{bid.bidderName}</TableCell>
                  <TableCell className="text-right font-semibold">${bid.amount.toLocaleString()}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No bids were placed in this auction.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="text-accent" />
            Bid Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card-foreground/5">
                <Users className="h-8 w-8 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Total Participants</p>
                    <p className="text-2xl font-bold">{participantCount}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-4 rounded-lg bg-card-foreground/5">
                <Users className="h-8 w-8 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                    <p className="text-2xl font-bold">{bids.length}</p>
                </div>
            </div>
            <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Bid Distribution</h3>
                <div className="space-y-2">
                    {Object.entries(bidCounts).map(([range, count]) => (
                        <div key={range} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{range}</span>
                            <Badge variant="secondary">{count} bid{count > 1 ? 's' : ''}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
