
import type { AuctionItem } from "./types";
import { addDays } from "date-fns";
import { PlaceHolderImages } from "./placeholder-images";
import { getCategories } from "./categories";

const now = new Date();
const categories = getCategories();

const items: AuctionItem[] = [
  {
    id: "1",
    name: "Vintage Pocket Watch",
    description: "A beautifully preserved gold-plated pocket watch from the early 20th century. Features intricate engravings and a porcelain dial. In working condition.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '1')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '1')?.imageHint || ''],
    category: categories[0]?.name || "Antiques",
    type: "live",
    endDate: addDays(now, 2).toISOString(),
    startingPrice: 500,
    currentBid: 750,
    highBidder: "WatchFan82",
    participationFee: 10,
  },
  {
    id: "2",
    name: "Abstract Oil Painting",
    description: "A vibrant, large-scale abstract painting by a renowned contemporary artist. A statement piece for any modern home or office.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '2')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '2')?.imageHint || ''],
    category: categories[1]?.name || "Art",
    type: "live",
    endDate: addDays(now, 1).toISOString(),
    startingPrice: 1200,
    currentBid: 1550,
    highBidder: "ArtLover88",
  },
  {
    id: "3",
    name: "Antique Wooden Chair",
    description: "A hand-carved mahogany chair with original upholstery. Dates back to the Victorian era. Perfect as a decorative accent.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '3')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '3')?.imageHint || ''],
    category: categories[2]?.name || "Furniture",
    type: "live",
    endDate: addDays(now, 3).toISOString(),
    startingPrice: 250,
    currentBid: 250,
  },
  {
    id: "4",
    name: "Rare Stamp Collection",
    description: "A curated collection of rare stamps from around the world, including several sought-after misprints. Housed in a professional album.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '4')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '4')?.imageHint || ''],
    category: categories[3]?.name || "Collectibles",
    type: "sealed",
    endDate: addDays(now, 7).toISOString(),
    startingPrice: 2000,
    maxAllowedValue: 10000,
    participationFee: 50,
  },
  {
    id: "5",
    name: "Signed Baseball",
    description: "A baseball autographed by a legendary Hall of Fame player. Comes with a certificate of authenticity. A must-have for any sports memorabilia collector.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '5')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '5')?.imageHint || ''],
    category: categories[4]?.name || "Sports Memorabilia",
    type: "sealed",
    endDate: addDays(now, 5).toISOString(),
    startingPrice: 300,
    maxAllowedValue: 1500,
  },
  {
    id: "6",
    name: "First Edition Novel",
    description: "A rare, first edition printing of a classic 20th-century novel. In excellent condition with original dust jacket.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '6')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '6')?.imageHint || ''],
    category: categories[5]?.name || "Books",
    type: "live",
    endDate: addDays(now, 4).toISOString(),
    startingPrice: 800,
    currentBid: 950,
    highBidder: "BookWorm22",
  },
  {
    id: "7",
    name: "Designer Handbag",
    description: "An iconic, limited-edition leather handbag from a world-famous luxury brand. Barely used and in pristine condition.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '7')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '7')?.imageHint || ''],
    category: categories[6]?.name || "Fashion",
    type: "sealed",
    endDate: addDays(now, 6).toISOString(),
    startingPrice: 1500,
    maxAllowedValue: 5000,
    participationFee: 25,
  },
   {
    id: "8",
    name: "Classic Electric Guitar",
    description: "A vintage model electric guitar known for its legendary tone. All original parts, with a beautifully aged sunburst finish.",
    imageUrls: [PlaceHolderImages.find(p => p.id === '8')?.imageUrl || ''],
    imageHints: [PlaceHolderImages.find(p => p.id === '8')?.imageHint || ''],
    category: categories[7]?.name || "Musical Instruments",
    type: "live",
    endDate: addDays(now, 10).toISOString(),
    startingPrice: 2500,
    currentBid: 3200,
    highBidder: "RockStar01",
  },
];

export function getAuctionItems(): AuctionItem[] {
  return items;
}

export function getAuctionItem(id: string): AuctionItem | undefined {
  return items.find((item) => item.id === id);
}
