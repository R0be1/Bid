

import { getAuctionItems } from "@/lib/data";
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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// MOCK: In a real app, this would come from the logged-in user's session
const MOCK_AUCTIONEER_NAME = "Vintage Treasures LLC";

export default function AdminResultsPage() {
  const allItems = getAuctionItems();
  // Filter items for the logged-in auctioneer
  const auctioneerItems = allItems.filter(item => item.auctioneerName === MOCK_AUCTIONEER_NAME);
  const completedAuctions = auctioneerItems.filter(item => new Date(item.endDate) < new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Auction Results</h1>
        <p className="text-muted-foreground">View results for your completed auctions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Completed Auctions</CardTitle>
          <CardDescription>
            A list of all your auctions that have ended. Click 'View' to see detailed results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedAuctions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAuctions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant={item.type === 'live' ? 'destructive' : 'secondary'} className="capitalize">{item.type}</Badge></TableCell>
                    <TableCell>{format(new Date(item.endDate), "PPP p")}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/auctions/${item.id}/results`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Results
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center text-muted-foreground py-8">
                <p>You have no completed auctions yet.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
