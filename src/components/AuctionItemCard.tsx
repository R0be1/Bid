import type { AuctionItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Clock } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface AuctionItemCardProps {
  item: AuctionItem;
}

export default function AuctionItemCard({ item }: AuctionItemCardProps) {
  const currentPrice = item.currentBid ?? item.startingPrice;

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/auctions/${item.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={600}
              height={400}
              data-ai-hint={item.imageHint}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
            {item.name}
          </CardTitle>
          <div className="mt-2 flex items-center text-sm text-foreground/80">
            <Tag className="mr-2 h-4 w-4" />
            <span>{item.type === 'live' ? 'Current Bid:' : 'Starts At:'}</span>
            <span className="ml-1 font-bold">${currentPrice.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center text-sm text-foreground/80">
            <Clock className="mr-2 h-4 w-4" />
            <CountdownTimer endDate={item.endDate} />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            {item.type === "live" ? "Bid Now" : "View Details"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
