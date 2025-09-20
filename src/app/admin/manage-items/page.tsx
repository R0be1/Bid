
import { ExistingItemsList } from "./_components/existing-items-list";
import { getAuctionItemsForAdmin } from "@/lib/data/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";


export default async function ManageItemsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const auctioneerItems = await getAuctionItemsForAdmin(user.id);

  return (
    <div className="space-y-8 p-4 md:p-8">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Manage Auction Items</h1>
            <p className="text-muted-foreground">Create and manage your auction items from here.</p>
          </div>
           <Button asChild>
                <Link href="/admin/manage-items/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Auction Item
                </Link>
            </Button>
        </div>

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
