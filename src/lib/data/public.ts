

'use server';

import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import type { AuctionItem, Bid } from '../types';
import { UserStatus } from '@prisma/client';

export async function getAuctionItemsForListing(): Promise<AuctionItem[]> {
  noStore();
  try {
    const items = await prisma.auctionItem.findMany({
      where: {
        auctioneer: {
            user: {
                status: UserStatus.APPROVED,
            }
        },
        endDate: {
            gte: new Date(), // Only show active or upcoming auctions
        }
      },
      include: {
        category: true,
        auctioneer: true,
        images: true,
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
           include: {
            bidder: true,
          }
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
      imageUrls: item.images.map(img => img.url),
      categoryName: item.category.name,
      auctioneerName: item.auctioneer.companyName,
      type: item.type,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      startingPrice: item.startingPrice,
      participationFee: item.participationFee ?? undefined,
      securityDeposit: item.securityDeposit ?? undefined,
      currentBid: item.bids.length > 0 ? item.bids[0].amount : item.startingPrice,
      highBidder: item.bids.length > 0 ? `${item.bids[0].bidder.firstName} ${item.bids[0].bidder.lastName}` : undefined,
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
        auctioneer: true,
        images: true,
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
          include: {
            bidder: true,
          }
        },
      },
    });

    if (!item) return null;

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrls: item.images.map(img => img.url),
      categoryName: item.category.name,
      auctioneerName: item.auctioneer.companyName,
      type: item.type,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      startingPrice: item.startingPrice,
      participationFee: item.participationFee ?? undefined,
      securityDeposit: item.securityDeposit ?? undefined,
      currentBid: item.bids.length > 0 ? item.bids[0].amount : item.startingPrice,
      highBidder: item.bids.length > 0 ? `${item.bids[0].bidder.firstName} ${item.bids[0].bidder.lastName}` : "None",
      maxAllowedValue: item.maxAllowedValue ?? undefined,
      minIncrement: item.minIncrement ?? undefined,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch auction item.');
  }
}


export async function getAuctionBidsForResults(itemId: string): Promise<Bid[]> {
    noStore();
    try {
        const bids = await prisma.bid.findMany({
            where: {
                auctionItemId: itemId
            },
            include: {
                bidder: true
            },
            orderBy: {
                amount: 'desc'
            }
        });

        return bids.map(bid => ({
            bidderName: `${bid.bidder.firstName} ${bid.bidder.lastName}`,
            amount: bid.amount,
            date: bid.createdAt.toISOString()
        }));

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch bids.');
    }
}


export async function getCategoriesForListing() {
    noStore();
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return categories;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch categories.');
    }
}

export async function getAuctioneersForListing() {
    noStore();
    try {
        const auctioneers = await prisma.auctioneerProfile.findMany({
            where: {
                user: {
                    status: UserStatus.APPROVED
                }
            },
            select: {
                id: true,
                companyName: true,
            },
            orderBy: {
                companyName: 'asc'
            }
        });
        return auctioneers.map(a => ({ id: a.id, name: a.companyName}));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch auctioneers.');
    }
}

    