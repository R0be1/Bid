import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuctionItems } from "@/lib/data";
import AuctionItemCard from "@/components/AuctionItemCard";

export default function Home() {
  const allItems = getAuctionItems();
  const liveItems = allItems.filter((item) => item.type === "live");
  const sealedItems = allItems.filter((item) => item.type === "sealed");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
          Welcome to BidCraft
        </h1>
        <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
          Discover unique treasures and compete in exciting live and sealed-bid auctions. Your next great find is just a bid away.
        </p>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto">
          <TabsTrigger value="live">Live Auctions</TabsTrigger>
          <TabsTrigger value="sealed">Sealed Bid Auctions</TabsTrigger>
        </TabsList>
        <TabsContent value="live">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 mt-6">
            {liveItems.length > 0 ? (
              liveItems.map((item) => (
                <AuctionItemCard key={item.id} item={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No live auctions at the moment. Check back soon!
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="sealed">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 mt-6">
            {sealedItems.length > 0 ? (
              sealedItems.map((item) => (
                <AuctionItemCard key={item.id} item={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No sealed bid auctions available right now.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
