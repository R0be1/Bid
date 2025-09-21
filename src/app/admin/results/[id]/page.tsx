
import { notFound, redirect } from "next/navigation";
import { getAuctionItemForListing, getAuctionBidsForResults } from "@/lib/data/public";
import { getMessageTemplatesForAdmin } from "@/lib/data/admin";
import { getCommunicationsForAdmin } from "@/lib/data/admin";
import { getCurrentUser } from "@/lib/data/server-only";
import { AuctionResultsClientPage } from "./_components/auction-results-client-page";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AuctionResultsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = params;

  const [item, bids, announcements, messageTemplates] = await Promise.all([
    getAuctionItemForListing(id),
    getAuctionBidsForResults(id),
    getCommunicationsForAdmin(id),
    getMessageTemplatesForAdmin()
  ]);

  if (!item) {
    notFound();
  }

  const auctionEnded = new Date() >= new Date(item.endDate);

  if (!auctionEnded) {
    return (
        <div className="text-center">
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
    <AuctionResultsClientPage
      item={item}
      initialBids={bids}
      initialAnnouncements={announcements}
      messageTemplates={messageTemplates}
    />
  );
}
