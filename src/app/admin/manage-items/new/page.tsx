
import { CreateAuctionForm } from "../../_components/create-auction-form";
import { getCategoriesForAdmin } from "@/lib/data/admin";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function NewAuctionItemPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const categories = await getCategoriesForAdmin();

  return (
    <div className="space-y-8 p-4 md:p-8">
       <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Create New Auction Item</h1>
          <p className="text-muted-foreground">Fill out the form below to add a new item to your auctions.</p>
        </div>
      
      <CreateAuctionForm categories={categories} />
    </div>
  );
}
