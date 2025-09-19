"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuctionItemCard from "@/components/AuctionItemCard";
import type { AuctionItem, Category } from "@/lib/types";

interface HomePageClientProps {
  items: AuctionItem[];
  categories: Category[];
  auctioneers: { id: string; name: string }[];
}

export function HomePageClient({ items, categories, auctioneers }: HomePageClientProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = (filter: string, type: "category" | "auctioneer") => {
    if (type === "category") {
      return items.filter((item) => item.categoryName === filter);
    }
    return items.filter((item) => item.auctioneerName === filter);
  };

  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-fit lg:grid-cols-none">
        <TabsTrigger value="all">All Items</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="auctioneers">Auctioneers</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <AuctionItemCard key={item.id} item={item} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="categories" className="mt-6">
        <Tabs
          orientation="vertical"
          defaultValue={categories[0]?.name}
          className="flex flex-col md:flex-row gap-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-1/4 md:grid-cols-1 h-fit">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.name}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.name} className="w-full mt-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems(category.name, "category").map((item) => (
                  <AuctionItemCard key={item.id} item={item} />
                ))}
                {filteredItems(category.name, "category").length === 0 && (
                    <p className="text-muted-foreground col-span-full">No items found in this category.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </TabsContent>
      <TabsContent value="auctioneers" className="mt-6">
        <Tabs
          orientation="vertical"
          defaultValue={auctioneers[0]?.name}
          className="flex flex-col md:flex-row gap-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-1/4 md:grid-cols-1 h-fit">
            {auctioneers.map((auctioneer) => (
              <TabsTrigger key={auctioneer.id} value={auctioneer.name}>
                {auctioneer.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {auctioneers.map((auctioneer) => (
            <TabsContent key={auctioneer.id} value={auctioneer.name} className="w-full mt-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems(auctioneer.name, "auctioneer").map((item) => (
                  <AuctionItemCard key={item.id} item={item} />
                ))}
                 {filteredItems(auctioneer.name, "auctioneer").length === 0 && (
                    <p className="text-muted-foreground col-span-full">No items found for this auctioneer.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
