
import { getAuctioneersForTable } from '@/lib/data/super-admin';
import { ManageAuctioneerClientPage } from './_components/manage-auctioneer-client-page';

export default async function ManageAuctioneerPage() {
  const auctioneers = await getAuctioneersForTable();

  return <ManageAuctioneerClientPage auctioneers={auctioneers} />;
}
