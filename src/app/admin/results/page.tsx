
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
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAuctionItemsForAdmin } from "@/lib/data/admin";
import type { AuctionItem } from "@prisma/client";

export default async function AdminResultsPage() {
  const user = getCurrentUser();
  if (!user) redirect('/login');
  
  const auctioneerItems = await getAuctionItemsForAdmin(user.id);
  const completedAuctions = auctioneerItems.filter(item => new Date(item.endDate) < new Date());

  return (
    <div className="space-y-8">
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
                {completedAuctions.map((item: AuctionItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant={item.type === 'LIVE' ? 'destructive' : 'secondary'} className="capitalize">{item.type.toLowerCase()}</Badge></TableCell>
                    <TableCell>{format(new Date(item.endDate), "PPP p")}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/results/${item.id}`}>
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
