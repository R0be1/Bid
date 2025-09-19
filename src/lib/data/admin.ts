
'use server';

import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';


export async function getCategoriesForAdmin() {
  noStore();
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function getAuctionItemsForAdmin(userId: string) {
    noStore();

    try {
        const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
            where: { userId }
        });

        if (!auctioneerProfile) {
            return [];
        }

        const items = await prisma.auctionItem.findMany({
            where: { auctioneerId: auctioneerProfile.id },
            orderBy: { createdAt: 'desc' }
        });

        return items;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch auction items.');
    }
}


export async function getAuctionItemForEdit(itemId: string, userId: string) {
    noStore();
    try {
        const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
            where: { userId }
        });

        if (!auctioneerProfile) {
            throw new Error('Auctioneer profile not found.');
        }

        const item = await prisma.auctionItem.findUnique({
            where: {
                id: itemId,
                auctioneerId: auctioneerProfile.id,
            },
            include: {
                images: true,
            }
        });

        return item;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch auction item for editing.');
    }
}
