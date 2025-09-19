
'use server';

import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import type { AuctionItem } from '../types';

export async function getAuctionItemsForListing(): Promise<AuctionItem[]> {
  noStore();
  try {
    const items = await prisma.auctionItem.findMany({
      include: {
        category: true,
        auctioneer: {
          include: {
            user: true,
          },
        },
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        endDate: 'asc',
      },
    });

    return items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrls: item.images.map(img => img.url), // Assuming images is an array of objects with a url property
      imageHints: item.images.map(img => img.hint), // Assuming images is an array of objects with a hint property
      category: item.category.name,
      auctioneerName: item.auctioneer.companyName,
      type: item.type === 'LIVE' ? 'live' : 'sealed',
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      startingPrice: item.startingPrice,
      participationFee: item.participationFee ?? undefined,
      securityDeposit: item.securityDeposit ?? undefined,
      currentBid: item.bids.length > 0 ? item.bids[0].amount : item.startingPrice,
      highBidder: item.bids.length > 0 ? 'A bidder' : undefined, // Bidder name is private for listings
      maxAllowedValue: item.maxAllowedValue ?? undefined,
      minIncrement: item.minIncrement ?? undefined,
    }));

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch auction items.');
  }
}

export async function getAuctionItemForListing(id: string): Promise<AuctionItem | null> {
  noStore();
  try {
    const item = await prisma.auctionItem.findUnique({
      where: { id },
      include: {
        category: true,
        auctioneer: {
          include: {
            user: true,
          },
        },
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!item) return null;

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrls: item.images.map(img => img.url),
      imageHints: item.images.map(img => img.hint),
      categoryName: item.category.name,
      auctioneerName: item.auctioneer.companyName,
      type: item.type,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      startingPrice: item.startingPrice,
      participationFee: item.participationFee ?? undefined,
      securityDeposit: item.securityDeposit ?? undefined,
      currentBid: item.bids.length > 0 ? item.bids[0].amount : undefined,
      highBidder: item.bids.length > 0 ? 'A Bidder' : undefined,
      maxAllowedValue: item.maxAllowedValue ?? undefined,
      minIncrement: item.minIncrement ?? undefined,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch auction item.');
  }
}
