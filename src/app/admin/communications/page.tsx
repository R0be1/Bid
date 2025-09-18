

import { getCommunications } from "@/lib/communications";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// MOCK: In a real app, this would come from the logged-in user's session
const MOCK_AUCTIONEER_NAME = "Vintage Treasures LLC";

export default function CommunicationsPage() {
  const allCommunications = getCommunications();
  const allItems = getAuctionItems();
  const auctioneerItemIds = new Set(allItems.filter(item => item.auctioneerName === MOCK_AUCTIONEER_NAME).map(item => item.id));

  const communications = allCommunications.filter(log => auctioneerItemIds.has(log.auctionId));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Communication History</h1>
        <p className="text-muted-foreground">A log of all announcements sent for your auctions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Announcements</CardTitle>
          <CardDescription>
            This log shows all the email and SMS communications sent from your auction results pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {communications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Auction Item</TableHead>
                  <TableHead>Template Used</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Recipients</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communications.map((log) => (
                  <TableRow key={log.id}>
                     <TableCell>{format(log.sentAt, "PPP p")}</TableCell>
                    <TableCell>
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/auctions/${log.auctionId}/results`}>
                           {log.auctionName}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{log.templateName}</TableCell>
                     <TableCell>
                        <Badge variant={log.channel === 'email' ? 'secondary' : 'default'} className="capitalize">
                            {log.channel}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{log.recipientsCount} bidder(s)</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center text-muted-foreground py-8">
                <p>No communications have been sent for your auctions yet.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
