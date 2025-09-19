
import { CreateAuctionForm } from "../_components/create-auction-form";
import { ExistingItemsList } from "./_components/existing-items-list";
import { getCategoriesForAdmin } from "@/lib/data/admin";
import { getAuctionItemsForAdmin } from "@/lib/data/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function ManageItemsPage() {
  const user = getCurrentUser();
  if (!user) redirect('/login');

  const categories = await getCategoriesForAdmin();
  const auctioneerItems = await getAuctionItemsForAdmin(user.id);

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
