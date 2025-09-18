

import { CreateAuctionForm } from "../_components/create-auction-form";
import { ExistingItemsList } from "./_components/existing-items-list";
import { getCategories } from "@/lib/categories";
import { getAuctionItems } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// MOCK: In a real app, this would come from the logged-in user's session
const MOCK_AUCTIONEER_NAME = "Vintage Treasures LLC";

export default function ManageItemsPage() {
  const categories = getCategories();
  const allItems = getAuctionItems();
  const auctioneerItems = allItems.filter(item => item.auctioneerName === MOCK_AUCTIONEER_NAME);

  return (
    <div className="space-y-8 p-4 md:p-8">
       <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Manage Auction Items</h1>
          <p className="text-muted-foreground">Create and manage your auction items from here.</p>
        </div>
      
      <CreateAuctionForm categories={categories} />

      <Card>
        <CardHeader>
            <CardTitle>Your Existing Items</CardTitle>
        </CardHeader>
        <CardContent>
            <ExistingItemsList items={auctioneerItems} />
        </CardContent>
      </Card>
    </div>
  );
}
