
import { CreateAuctionForm } from "./_components/create-auction-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/categories";

export default function AdminPage() {
  const categories = getCategories();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Create and manage auction items from here.</p>
        </div>
        <Button asChild>
            <Link href="/admin/categories">Manage Categories</Link>
        </Button>
      </div>
      
      <CreateAuctionForm categories={categories} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline text-primary mb-4">Manage Existing Items</h2>
        <p className="text-muted-foreground">Functionality to edit and delete existing auction items will be available here soon.</p>
      </div>
    </div>
  );
}
