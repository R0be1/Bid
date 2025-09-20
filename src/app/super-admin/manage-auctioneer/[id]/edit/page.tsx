import { getAuctioneerForEdit } from "@/lib/data/super-admin";
import { notFound } from "next/navigation";
import { EditAuctioneerForm } from "./_components/edit-form";

export default async function EditAuctioneerPage({
  params,
}: {
  params: { id: string };
}) {
  const auctioneer = await getAuctioneerForEdit(params.id);

  if (!auctioneer) {
    notFound();
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
          Edit Auctioneer
        </h1>
        <p className="text-muted-foreground">
          Modify the details for {auctioneer.name}.
        </p>
      </div>
      <EditAuctioneerForm auctioneer={auctioneer} />
    </div>
  );
}
