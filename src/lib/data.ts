

import type { AuctionItem, Bid } from "./types";
import { addDays, subDays } from "date-fns";
// This file is now deprecated for listing pages.
// Data is fetched from src/lib/data/public.ts
// This file is only kept for mock bid data for results pages.

const now = new Date();

const mockBids: { [itemId: string]: Bid[] } = {
    "3": [
        { bidderName: "VintageFinds", amount: 450, date: subDays(now, 1).toISOString() },
        { bidderName: "FurnishLover", amount: 425, date: subDays(now, 2).toISOString() },
        { bidderName: "Collector22", amount: 400, date: subDays(now, 2).toISOString() },
        { bidderName: "OldTimer", amount: 375, date: subDays(now, 3).toISOString() },
        { bidderName: "JaneDoe", amount: 350, date: subDays(now, 3).toISOString() },
        { bidderName: "ChairMan", amount: 325, date: subDays(now, 3).toISOString() },
        { bidderName: "BidMaster", amount: 300, date: subDays(now, 4).toISOString() },
        { bidderName: "NewbieBidder", amount: 275, date: subDays(now, 4).toISOString() },
        { bidderName: "FirstTimer", amount: 250, date: subDays(now, 4).toISOString() },
    ],
    "5": [
        { bidderName: "SportFanatic", amount: 1450, date: subDays(now, 3).toISOString() },
        { bidderName: "CollectorPro", amount: 1400, date: subDays(now, 3).toISOString() },
        { bidderName: "BaseballNut", amount: 1350, date: subDays(now, 4).toISOString() },
        { bidderName: "MantleFan", amount: 1200, date: subDays(now, 5).toISOString() },
        { bidderName: "Yankees1", amount: 1100, date: subDays(now, 6).toISOString() },
        { bidderName: "HighBidder", amount: 1000, date: subDays(now, 7).toISOString() },
        { bidderName: "Lucky7", amount: 950, date: subDays(now, 8).toISOString() },
        { bidderName: "BidMachine", amount: 800, date: subDays(now, 9).toISOString() },
        { bidderName: "TheBroker", amount: 750, date: subDays(now, 9).toISOString() },
        { bidderName: "PennyPincher", amount: 600, date: subDays(now, 9).toISOString() },
        { bidderName: "LastMinute", amount: 550, date: subDays(now, 10).toISOString() },
        { bidderName: "AnotherBidder", amount: 500, date: subDays(now, 10).toISOString() },
    ]
};


export function getAuctionBidsForResults(id: string): Bid[] {
    return mockBids[id]?.sort((a, b) => b.amount - a.amount) || [];
}
