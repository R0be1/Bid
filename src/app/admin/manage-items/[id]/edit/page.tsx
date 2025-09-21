
import { getAuctionItemForEdit } from "@/lib/data/admin";
import { getCategoriesForAdmin } from "@/lib/data/admin";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { EditAuctionForm } from "./_components/edit-auction-form";

export default async function EditAuctionItemPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  
  const [item, categories] = await Promise.all([
    getAuctionItemForEdit(params.id, user.id),
    getCategoriesForAdmin()
  ]);

  if (!item) {
    notFound();
  }

  // Redirect if the auction has started
  if (new Date(item.startDate) <= new Date()) {
    redirect('/admin/manage-items');
  }


  return (
    <div className="space-y-8 p-4 md:p-8">
       <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Edit Auction Item</h1>
          <p className="text-muted-foreground">Modify details for "{item.name}"</p>
        </div>
      
      <EditAuctionForm item={item} categories={categories} />
    </div>
  );
}
