
"use client";

import { getAuctionItem, getAuctionBids } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import type { Bid, CommunicationLog } from "@/lib/types";
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
import { AnnounceResultsForm } from "./_components/announce-results-form";
import { AnnouncementHistory } from "./_components/announcement-history";
import { getMessageTemplates } from "@/lib/messages";
import { getCommunications } from "@/lib/communications";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function AuctionResultsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const item = getAuctionItem(id);
  
  if (!item) {
    notFound();
  }
  
  const bids = getAuctionBids(id);
  const auctionEnded = new Date() >= new Date(item.endDate);
  const participantCount = new Set(bids.map(b => b.bidderName)).size;
  const messageTemplates = getMessageTemplates();
  const [announcements, setAnnouncements] = useState<CommunicationLog[]>([]);

  const [winnersPage, setWinnersPage] = useState(1);
  const [winnersRowsPerPage, setWinnersRowsPerPage] useState(5);

  const paginatedWinners = useMemo(() => {
    const startIndex = (winnersPage - 1) * winnersRowsPerPage;
    return bids.slice(startIndex, startIndex + winnersRowsPerPage);
  }, [bids, winnersPage, winnersRowsPerPage]);


  useEffect(() => {
    // Load initial announcements for this auction
    const allCommunications = getCommunications();
    setAnnouncements(allCommunications.filter(log => log.auctionId === id));
  }, [id]);

  const handleAddAnnouncement = (announcement: CommunicationLog) => {
    setAnnouncements(prev => [announcement, ...prev]);
  };

  const bidCounts = bids.reduce((acc, bid) => {
      const priceRange = Math.floor(bid.amount / 100) * 100;
      const rangeLabel = `${priceRange} - ${priceRange + 99} Birr`;
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
            Bids for this auction, sorted by amount. The highest bidder is the winner.
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
              {paginatedWinners.length > 0 ? paginatedWinners.map((bid, index) => {
                const rank = (winnersPage - 1) * winnersRowsPerPage + index + 1;
                return (
                  <TableRow key={rank} className={rank === 1 ? "bg-accent/10" : ""}>
                    <TableCell className="font-bold">
                      {rank === 1 ? <Trophy className="h-5 w-5 text-yellow-500" /> : `#${rank}`}
                    </TableCell>
                    <TableCell>{bid.bidderName}</TableCell>
                    <TableCell className="text-right font-semibold">{bid.amount.toLocaleString()} Birr</TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No bids were placed in this auction.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           <DataTablePagination
              page={winnersPage}
              setPage={setWinnersPage}
              rowsPerPage={winnersRowsPerPage}
              setRowsPerPage={setWinnersRowsPerPage}
              totalRows={bids.length}
            />
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
