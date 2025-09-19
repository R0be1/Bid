

import type { User as PrismaUser, Role as PrismaRole, AuctioneerProfile as PrismaAuctioneerProfile, AuctionItem as PrismaAuctionItem, Bid as PrismaBid, UserStatus, PaymentMethod, AuctionItemType } from '@prisma/client';

export type AuctionItem = {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  imageHints: string[];
  categoryName: string;
  auctioneerName: string;
  type: AuctionItemType;
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

export type AuctionItemFee = Pick<AuctionItem, 'id' | 'name' | 'participationFee' | 'securityDeposit'>;
export type PaymentType = 'participation' | 'deposit';


export type Category = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  paidParticipation: boolean;
  paidDeposit: boolean;
  paymentMethod?: PaymentMethod | null;
  receiptUrl?: string | null;
};

export type Bid = {
    bidderName: string;
    amount: number;
    date: string;
};

export type MessageTemplate = {
  id: string;
  name: string;
  channel: 'email' | 'sms';
  template: string;
};

export type CommunicationLog = {
  id: string;
  auctionId: string;
  auctionName: string;
  templateName: string;
  channel: 'email' | 'sms';
  recipientsCount: number;
  sentAt: Date;
}

export type Auctioneer = {
  id:string;
  name: string;
  address: string;
  status: 'active' | 'inactive';
  user: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    tempPassword?: string;
  };
  createdAt: Date;
};

export type SuperAdmin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tempPassword?: string;
};
