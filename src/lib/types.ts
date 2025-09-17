
export type AuctionItem = {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  imageHints: string[];
  category: string;
  type: 'live' | 'sealed';
  endDate: string; // ISO string
  startingPrice: number;
  participationFee?: number;
  securityDeposit?: number;
  currentBid?: number;
  highBidder?: string;
  maxAllowedValue?: number; // for sealed bids
  minIncrement?: number; // for live auctions
};

export type Category = {
  id: string;
  name: string;
};
