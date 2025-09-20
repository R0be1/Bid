
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuctionItems as getMockAuctionItems } from "@/lib/data";
import { getCategories as getMockCategories } from "@/lib/categories";
import { getAuctioneers as getMockAuctioneers } from "@/lib/auctioneers";
import { getAuctionItemsForListing, getCategoriesForListing, getAuctioneersForListing } from "@/lib/data/public";
import AuctionItemCard from "@/components/AuctionItemCard";
import type { AuctionItem } from "@/lib/types";
import { ListFilter, Gavel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Category = { id: string; name: string };
type Auctioneer = { id: string; name: string };

async function getAuctionData() {
  try {
    // Try to fetch from the database
    const [items, categories, auctioneers] = await Promise.all([
      getAuctionItemsForListing(),
      getCategoriesForListing(),
      getAuctioneersForListing(),
    ]);
    return { items, categories, auctioneers };
  } catch (error) {
    console.warn("Database connection failed, falling back to mock data.", error);
    // Fallback to mock data if the database fails
    const mockItems = getMockAuctionItems().map(item => ({...item, categoryName: item.category}));
    const mockCategories = getMockCategories();
    const mockAuctioneers = getMockAuctioneers().filter(a => a.status === 'active').map(a => ({ id: a.id, name: a.name }));
    return { items: mockItems, categories: mockCategories, auctioneers: mockAuctioneers };
  }
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAuctioneer, setSelectedAuctioneer] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("live");
  const [isLoading, setIsLoading] = useState(true);

  const [allItems, setAllItems] = useState<AuctionItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [auctioneers, setAuctioneers] = useState<Auctioneer[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getAuctionData();
      setAllItems(data.items);
      setCategories(data.categories);
      setAuctioneers(data.auctioneers);
      setIsLoading(false);
    }
    loadData();
  }, []);
  
  const filteredItems = allItems.filter(
    (item) =>
      (selectedCategory === "all" || item.categoryName === selectedCategory) &&
      (selectedAuctioneer === "all" || item.auctioneerName === selectedAuctioneer)
  );

  const liveItems = filteredItems.filter((item) => item.type.toLowerCase() === "live");
  const sealedItems = filteredItems.filter((item) => item.type.toLowerCase() === "sealed");

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
          Welcome to NIBtera ጨረታ
        </h1>
        <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
          Compete in exciting live and sealed-bid auctions.
        </p>
      </div>

       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-4 px-2 border-b">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="live">Live Auctions</TabsTrigger>
            <TabsTrigger value="sealed">Sealed Bid Auctions</TabsTrigger>
          </TabsList>
          <div className="w-full md:w-auto md:min-w-[200px]">
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
          <div className="w-full md:w-auto md:min-w-[200px]">
             <Select value={selectedAuctioneer} onValueChange={setSelectedAuctioneer}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Filter by auctioneer..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Auctioneers</SelectItem>
                  {auctioneers.map((auctioneer: Auctioneer) => (
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


function HomePageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="text-center px-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4 px-2">
        <Skeleton className="h-10 w-full md:w-[400px]" />
        <Skeleton className="h-10 w-full md:w-[200px]" />
        <Skeleton className="h-10 w-full md:w-[200px]" />
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
