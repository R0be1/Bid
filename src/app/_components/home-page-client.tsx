
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuctionItemCard from "@/components/AuctionItemCard";
import type { AuctionItem } from "@/lib/types";
import { ListFilter, Gavel } from "lucide-react";
import type { Category as PrismaCategory } from "@prisma/client";

interface HomePageClientProps {
  items: AuctionItem[];
  categories: PrismaCategory[];
  auctioneers: { id: string; name: string }[];
}

export function HomePageClient({
  items,
  categories,
  auctioneers,
}: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAuctioneer, setSelectedAuctioneer] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("live");

  const filteredItems = items.filter(
    (item) =>
      (selectedCategory === "all" || item.categoryName === selectedCategory) &&
      (selectedAuctioneer === "all" || item.auctioneerName === selectedAuctioneer)
  );

  const liveItems = filteredItems.filter((item) => item.type === "LIVE");
  const sealedItems = filteredItems.filter((item) => item.type === "SEALED");

  return (
    <div className="space-y-8">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
          Welcome to NIBtera ጨረታ
        </h1>
        <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
          Discover unique treasures and compete in exciting live and sealed-bid
          auctions. Your next great find is just a bid away.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-4 px-2 border-b">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="live">Live Auctions</TabsTrigger>
            <TabsTrigger value="sealed">Sealed Bid Auctions</TabsTrigger>
          </TabsList>
          <div className="w-full md:w-auto md:min-w-[200px]">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto md:min-w-[200px]">
            <Select
              value={selectedAuctioneer}
              onValueChange={setSelectedAuctioneer}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by auctioneer..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auctioneers</SelectItem>
                {auctioneers.map((auctioneer) => (
                  <SelectItem key={auctioneer.id} value={auctioneer.name}>
                    {auctioneer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="live">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
            {liveItems.length > 0 ? (
              liveItems.map((item) => (
                <AuctionItemCard key={item.id} item={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">
                No live auctions match your criteria.
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="sealed">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
            {sealedItems.length > 0 ? (
              sealedItems.map((item) => (
                <AuctionItemCard key={item.id} item={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">
                No sealed bid auctions match your criteria.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
