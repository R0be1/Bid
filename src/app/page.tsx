
import { HomePageClient } from "./_components/home-page-client";
import { getAuctionItemsForListing, getCategoriesForListing, getAuctioneersForListing } from "@/lib/data/public";

export default async function Home() {

  const [items, categories, auctioneers] = await Promise.all([
    getAuctionItemsForListing(),
    getCategoriesForListing(),
    getAuctioneersForListing()
  ]);

  const activeAuctioneerNames = new Set(auctioneers.map((a) => a.name));
  const visibleItems = items.filter((item) => activeAuctioneerNames.has(item.auctioneerName));

  return (
    <HomePageClient 
      items={visibleItems} 
      categories={categories} 
      auctioneers={auctioneers} 
    />
  );
}
