
import { notFound } from "next/navigation";
import { getAuctionItemForListing, getAuctionBidsForResults } from "@/lib/data/public";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuctionResultsClientPage } from "./_components/auction-results-client-page";

export default async function AuctionResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [item, bids] = await Promise.all([
    getAuctionItemForListing(id),
    getAuctionBidsForResults(id),
  ]);

  if (!item) {
    notFound();
  }

  const auctionEnded = new Date() >= new Date(item.endDate);

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
            <h1 className="text-3xl font-bold font-headline text-primary">{item.name}</h1>
            <p className="text-lg text-muted-foreground">Auction Results</p>
        </div>
        <AuctionResultsClientPage item={item} initialBids={bids} />
    </div>
  );
}

