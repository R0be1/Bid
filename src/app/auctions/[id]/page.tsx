import { getAuctionItem } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";
import LiveBidding from "@/components/LiveBidding";
import SealedBidForm from "@/components/SealedBidForm";
import { Clock, Hammer, Tag, DollarSign, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AuctionDetailPage({ params }: { params: { id: string } }) {
  const item = getAuctionItem(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={item.imageUrls[0]}
            alt={item.name}
            width={600}
            height={400}
            data-ai-hint={item.imageHints[0]}
            className="rounded-lg object-cover w-full h-full shadow-lg"
          />
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={item.type === 'live' ? 'destructive' : 'secondary'}>
                {item.type === 'live' ? 'Live Auction' : 'Sealed Bid'}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{item.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{item.description}</p>
          </div>
          
          <Card className="bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-accent" />
                <span className="font-medium">Starting Price:</span>
                <span className="text-foreground/90">${item.startingPrice.toLocaleString()}</span>
              </div>
              {item.participationFee && item.participationFee > 0 && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span className="font-medium">Participation Fee:</span>
                  <span className="text-foreground/90">${item.participationFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-medium">Auction Ends:</span>
                <CountdownTimer endDate={item.endDate} />
              </div>
              <div className="flex items-center space-x-3">
                 <Hammer className="h-5 w-5 text-accent" />
                 <span className="font-medium">Auction Type:</span>
                 <span className="text-foreground/90 capitalize">{item.type}</span>
              </div>
            </CardContent>
          </Card>

          {item.type === "live" ? (
            <LiveBidding item={item} />
          ) : (
            <SealedBidForm item={item} />
          )}
        </div>
      </div>
    </div>
  );
}
