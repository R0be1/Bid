
'use server';

import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import type { User, UserStatus } from '@prisma/client';

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

export type UserForAdminTable = Pick<User, 'id' | 'email' | 'status' | 'paidParticipation' | 'paidDeposit' | 'paymentMethod' | 'receiptUrl'> & {
    name: string;
};

export async function getUsersForAdmin(): Promise<UserForAdminTable[]> {
    noStore();
    try {
        const users = await prisma.user.findMany({
            where: {
                roles: {
                    some: { name: 'BIDDER' }
                }
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
                createdAt: 'desc'
            }
        });

        return users.map(u => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            status: u.status,
            paidParticipation: u.paidParticipation,
            paidDeposit: u.paidDeposit,
            paymentMethod: u.paymentMethod,
            receiptUrl: u.receiptUrl
        }))

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');
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
