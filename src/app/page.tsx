
import { HomePageClient } from "./_components/home-page-client";
import { getAuctionItemsForListing, getCategoriesForListing, getAuctioneersForListing } from "@/lib/data/public";

export default async function Home() {
  const [items, categories, auctioneers] = await Promise.all([
    getAuctionItemsForListing(),
    getCategoriesForListing(),
    getAuctioneersForListing(),
  ]);

  return <HomePageClient initialItems={items} initialCategories={categories} initialAuctioneers={auctioneers} />;
}
