
"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type { User, UserStatus, MessageTemplate } from "@prisma/client";
import { getCurrentUser } from "../data/server-only";
import type { CommunicationLog } from "../types";

export async function getCategoriesForAdmin() {
  noStore();
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!auctioneerProfile) {
    return [];
  }
  
  try {
    const categories = await prisma.category.findMany({
      where: {
        auctioneerId: auctioneerProfile.id,
      },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export type UserForAdminTable = Pick<
  User,
  "id" | "email" | "status" | "paymentMethod" | "receiptUrl"
> & {
  name: string;
  paidParticipation: boolean;
  paidDeposit: boolean;
};

export async function getUsersForAdmin(
  auctioneerUserId: string,
): Promise<UserForAdminTable[]> {
  noStore();
  try {
    // 1. Find the auctioneer's profile ID
    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
      where: { userId: auctioneerUserId },
      select: { id: true },
    });

    if (!auctioneerProfile) {
      return [];
    }

    // 2. Find all auction items belonging to this auctioneer
    const auctioneerItems = await prisma.auctionItem.findMany({
      where: { auctioneerId: auctioneerProfile.id },
      select: { id: true },
    });
    const itemIds = auctioneerItems.map((item) => item.id);

    // 3. Find all bids placed on those items
    const bids = await prisma.bid.findMany({
      where: { auctionItemId: { in: itemIds } },
      select: { bidderId: true },
    });

    // 4. Get unique bidder IDs
    const bidderIds = [...new Set(bids.map((bid) => bid.bidderId))];
    
    if (bidderIds.length === 0) {
        return [];
    }

    // 5. Fetch the user details for those bidders
    const users = await prisma.user.findMany({
      where: {
        id: { in: bidderIds },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        paidParticipation: true,
        paidDeposit: true,
        paymentMethod: true,
        receiptUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      status: u.status,
      paidParticipation: u.paidParticipation,
      paidDeposit: u.paidDeposit,
      paymentMethod: u.paymentMethod,
      receiptUrl: u.receiptUrl,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function getAuctionItemsForAdmin(userId: string) {
  noStore();

  try {
    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!auctioneerProfile) {
      return [];
    }

    const items = await prisma.auctionItem.findMany({
      where: { auctioneerId: auctioneerProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true
      }
    });

    return items;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch auction items.");
  }
}

export async function getAuctionItemForEdit(itemId: string, userId: string) {
  noStore();
  try {
    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!auctioneerProfile) {
      throw new Error("Auctioneer profile not found.");
    }

    const item = await prisma.auctionItem.findUnique({
      where: {
        id: itemId,
        auctioneerId: auctioneerProfile.id,
      },
      include: {
        images: true,
      },
    });

    return item;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch auction item for editing.");
  }
}

export async function getCommunicationsForAdmin(auctionId?: string): Promise<CommunicationLog[]> {
    noStore();
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
        where: { userId: user.id },
        select: { id: true }
    });

    if (!auctioneerProfile) return [];

    try {
        const logs = await prisma.communicationLog.findMany({
            where: {
                auctioneerId: auctioneerProfile.id,
                ...(auctionId && { auctionId: auctionId })
            },
            orderBy: {
                sentAt: 'desc'
            }
        });
        return logs.map(c => ({
            id: c.id,
            auctionId: c.auctionId,
            auctionName: c.auctionName,
            templateName: c.templateName,
            channel: c.channel,
            recipientsCount: c.recipientsCount,
            sentAt: c.sentAt,
        }));
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch communication logs.");
    }
}


export async function getMessageTemplatesForAdmin(): Promise<MessageTemplate[]> {
    noStore();
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
        where: { userId: user.id }
    });

    if (!auctioneerProfile) {
        return [];
    }

    try {
        const templates = await prisma.messageTemplate.findMany({
            where: {
                auctioneerId: auctioneerProfile.id
            },
            orderBy: {
                name: 'asc'
            }
        });
        return templates;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch message templates.");
    }
}
