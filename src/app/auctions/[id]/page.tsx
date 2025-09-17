
import { getAuctionItem } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";
import LiveBidding from "@/components/LiveBidding";
import SealedBidForm from "@/components/SealedBidForm";
import { Clock, Hammer, Tag, DollarSign, ShieldCheck, Calendar, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function AuctionDetailPage({ params }: { params: { id: string } }) {
  const item = getAuctionItem(params.id);

  if (!item) {
    notFound();
  }
  
  const auctionActive = new Date() >= new Date(item.startDate) && new Date() < new Date(item.endDate);
  const auctionUpcoming = new Date() < new Date(item.startDate);
  const auctionEnded = new Date() >= new Date(item.endDate);


  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
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
            {item.imageUrls.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
                {item.imageUrls.slice(1).map((url, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1">
                    <Image
                    src={url}
                    alt={`${item.name} image ${index + 2}`}
                    width={200}
                    height={200}
                    data-ai-hint={item.imageHints[index+1]}
                    className="rounded-md object-cover w-full h-full shadow-md"
                    />
                </div>
                ))}
            </div>
            )}
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
              {item.securityDeposit && item.securityDeposit > 0 && (
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <span className="font-medium">Security Deposit:</span>
                  <span className="text-foreground/90">${item.securityDeposit.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                 <Calendar className="h-5 w-5 text-accent" />
                 <span className="font-medium">Starts On:</span>
                 <span className="text-foreground/90">{format(new Date(item.startDate), "PPP p")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-medium">Ends In:</span>
                <CountdownTimer endDate={item.endDate} />
              </div>
              <div className="flex items-center space-x-3">
                 <Hammer className="h-5 w-5 text-accent" />
                 <span className="font-medium">Auction Type:</span>
                 <span className="text-foreground/90 capitalize">{item.type}</span>
              </div>
            </CardContent>
          </Card>
          
          {auctionActive && (
            <>
              {item.type === "live" ? (
                <LiveBidding item={item} />
              ) : (
                <SealedBidForm item={item} />
              )}
            </>
          )}

          {auctionUpcoming && (
              <Card>
                  <CardHeader>
                      <CardTitle>Auction starts soon</CardTitle>
                      <CardDescription>
                          This auction has not started yet. Bidding will open on {format(new Date(item.startDate), "PPP p")}.
                      </CardDescription>
                  </CardHeader>
              </Card>
          )}
          
          <Card>
              <CardHeader>
                  <CardTitle>Auction Status</CardTitle>
                  <CardDescription>
                      {auctionEnded ? `This auction ended on ${format(new Date(item.endDate), "PPP p")}.` : auctionActive ? "This auction is currently active." : `This auction will start on ${format(new Date(item.startDate), "PPP p")}.`}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" disabled={!auctionEnded} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                    <Link href={`/auctions/${item.id}/results`}>
                        <Trophy className="mr-2 h-4 w-4" />
                        View Results
                    </Link>
                </Button>
                {!auctionEnded && <p className="text-xs text-center text-muted-foreground mt-2">Results will be available after the auction ends.</p>}
              </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
