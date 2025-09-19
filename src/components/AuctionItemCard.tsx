
import type { AuctionItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Clock, Gavel } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { Badge } from "@/components/ui/badge";

interface AuctionItemCardProps {
  item: AuctionItem;
}

export default function AuctionItemCard({ item }: AuctionItemCardProps) {
  const currentPrice = item.currentBid ?? item.startingPrice;

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/auctions/${item.id}`} className="flex flex-col h-full flex-grow">
        <CardHeader className="p-0">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={item.imageUrls[0]}
              alt={item.name}
              width={600}
              height={400}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-primary group-hover:text-accent transition-colors mb-2">
              {item.name}
            </CardTitle>
            <Badge variant="outline" className="text-xs whitespace-nowrap">{item.categoryName}</Badge>
          </div>
          <div className="mt-2 flex items-center text-sm text-foreground/80">
            <Gavel className="mr-2 h-4 w-4" />
            <span>{item.auctioneerName}</span>
          </div>
          <div className="mt-2 flex items-center text-sm text-foreground/80">
            <Tag className="mr-2 h-4 w-4" />
            <span>{item.type === 'LIVE' ? 'Current Bid:' : 'Starts At:'}</span>
            <span className="ml-1 font-bold">{currentPrice.toLocaleString()} Birr</span>
          </div>
          <div className="mt-2 flex items-center text-sm text-foreground/80">
            <Clock className="mr-2 h-4 w-4" />
            <CountdownTimer endDate={item.endDate} />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
            <Link href={`/auctions/${item.id}`}>
              {item.type === "LIVE" ? "Bid Now" : "View Details"}
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
