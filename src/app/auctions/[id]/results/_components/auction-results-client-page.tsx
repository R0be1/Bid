
"use client";

import { useState, useMemo } from "react";
import type { Bid, AuctionItem } from "@/lib/types";
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
import { Trophy, Users, BarChart2 } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface AuctionResultsClientPageProps {
    item: AuctionItem;
    initialBids: Bid[];
}

export function AuctionResultsClientPage({ item, initialBids }: AuctionResultsClientPageProps) {
  const [bids] = useState<Bid[]>(initialBids);
  
  const participantCount = new Set(bids.map(b => b.bidderName)).size;

  const [winnersPage, setWinnersPage] = useState(1);
  const [winnersRowsPerPage, setWinnersRowsPerPage] = useState(5);

  const paginatedWinners = useMemo(() => {
    const startIndex = (winnersPage - 1) * winnersRowsPerPage;
    return bids.slice(startIndex, startIndex + winnersRowsPerPage);
  }, [bids, winnersPage, winnersRowsPerPage]);

  const bidCounts = useMemo(() => bids.reduce((acc, bid) => {
      const priceRange = Math.floor(bid.amount / 100) * 100;
      const rangeLabel = `${priceRange} - ${priceRange + 99} Birr`;
      acc[rangeLabel] = (acc[rangeLabel] || 0) + 1;
      return acc;
  }, {} as Record<string, number>), [bids]);


  return (
    <>
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
        <CardContent className="space-y-4">
          <div className="overflow-x-auto border rounded-lg">
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
          </div>
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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                     {Object.keys(bidCounts).length === 0 && (
                        <p className="text-sm text-muted-foreground">No bid data available.</p>
                     )}
                </div>
            </div>
        </CardContent>
      </Card>
    </>
  );
}
