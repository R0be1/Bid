
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
import { getAuctionItems } from "@/lib/data";
import { getCategories } from "@/lib/categories";
import AuctionItemCard from "@/components/AuctionItemCard";
import type { Category } from "@/lib/types";
import { ListFilter } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allItems = getAuctionItems();
  const categories = getCategories();

  const filteredItems = allItems.filter(
    (item) =>
      selectedCategory === "all" || item.category === selectedCategory
  );

  const liveItems = filteredItems.filter((item) => item.type === "live");
  const sealedItems = filteredItems.filter((item) => item.type === "sealed");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
          Welcome to BidCraft
        </h1>
        <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
          Discover unique treasures and compete in exciting live and sealed-bid auctions. Your next great find is just a bid away.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Tabs defaultValue="live" className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="live">Live Auctions</TabsTrigger>
            <TabsTrigger value="sealed">Sealed Bid Auctions</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full md:w-auto md:min-w-[250px]">
           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by category..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      </div>


      <Tabs defaultValue="live" className="w-full">
         <TabsContent value="live">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
                {liveItems.length > 0 ? (
                liveItems.map((item) => (
                    <AuctionItemCard key={item.id} item={item} />
                ))
                ) : (
                <p className="col-span-full text-center text-muted-foreground">
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
                <p className="col-span-full text-center text-muted-foreground">
                    No sealed bid auctions match your criteria.
                </p>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
