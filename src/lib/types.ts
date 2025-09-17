export type AuctionItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  type: 'live' | 'sealed';
  endDate: string; // ISO string
  startingPrice: number;
  currentBid?: number;
  highBidder?: string;
  maxAllowedValue?: number; // for sealed bids
};
