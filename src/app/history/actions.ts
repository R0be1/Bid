
"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/data/server-only";
import { unstable_noStore as noStore } from "next/cache";

export type BidHistoryItem = {
    auctionId: string;
    auctionName: string;
    auctionImage: string;
    endDate: Date;
    yourHighestBid: number;
    isWinner: boolean;
    winningBid: number | null;
    winnerName: string | null;
    status: 'Won' | 'Lost' | 'In Progress';
};


export async function getBidHistory(): Promise<{success: boolean, history: BidHistoryItem[], message?: string}> {
    noStore();
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, history: [], message: 'User not authenticated.' };
    }

    try {
        // 1. Get all unique auctions the user has bid on
        const userBids = await prisma.bid.findMany({
            where: { bidderId: user.id },
            select: {
                auctionItemId: true,
                amount: true,
            },
            orderBy: {
                amount: 'desc'
            }
        });

        const auctionIds = [...new Set(userBids.map(bid => bid.auctionItemId))];
        
        if (auctionIds.length === 0) {
             return { success: true, history: [] };
        }

        const yourHighestBids = auctionIds.reduce((acc, id) => {
            acc[id] = userBids.find(b => b.auctionItemId === id)!.amount;
            return acc;
        }, {} as Record<string, number>);


        // 2. Fetch details for these auctions
        const auctions = await prisma.auctionItem.findMany({
            where: { id: { in: auctionIds } },
            include: {
                images: {
                    take: 1,
                },
                bids: {
                    orderBy: { amount: 'desc' },
                    take: 1,
                    include: {
                        bidder: {
                            select: { id: true, firstName: true, lastName: true }
                        }
                    }
                }
            }
        });

        const history: BidHistoryItem[] = auctions.map(auction => {
            const isEnded = new Date(auction.endDate) < new Date();
            const winningBid = auction.bids[0];
            const yourBid = yourHighestBids[auction.id];

            let status: 'Won' | 'Lost' | 'In Progress';
            let isWinner = false;

            if (!isEnded) {
                status = 'In Progress';
            } else if (winningBid && winningBid.bidder.id === user.id) {
                status = 'Won';
                isWinner = true;
            } else {
                status = 'Lost';
            }

            return {
                auctionId: auction.id,
                auctionName: auction.name,
                auctionImage: auction.images[0]?.url ?? 'https://picsum.photos/seed/placeholder/600/400',
                endDate: auction.endDate,
                yourHighestBid: yourBid,
                isWinner: isWinner,
                winningBid: winningBid ? winningBid.amount : null,
                winnerName: winningBid ? `${winningBid.bidder.firstName} ${winningBid.bidder.lastName}` : null,
                status: status,
            };
        });

        return { success: true, history: history.sort((a,b) => b.endDate.getTime() - a.endDate.getTime()) };

    } catch (error) {
        console.error("Error fetching bid history: ", error);
        return { success: false, history: [], message: 'Failed to fetch bidding history.' };
    }
}
