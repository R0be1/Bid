
import { getAuctionItemsForListing } from "@/lib/data/public";
import { getCategoriesForListing } from "@/lib/data/public";
import { getAuctioneersForListing } from "@/lib/data/public";
import { HomePageClient } from "./_components/home-page-client";

export default async function Home() {
  const [items, categories, auctioneers] = await Promise.all([
    getAuctionItemsForListing(),
    getCategoriesForListing(),
    getAuctioneersForListing(),
  ]);

  return (
    <HomePageClient
      items={items}
      categories={categories}
      auctioneers={auctioneers}
    />
  );
}
