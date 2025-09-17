
export type AuctionItem = {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  imageHints: string[];
  category: string;
  type: 'live' | 'sealed';
  startDate: string; // ISO string
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

export type User = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'blocked';
};
