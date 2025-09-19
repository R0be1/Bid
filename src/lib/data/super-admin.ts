
import prisma from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function getAuctioneersForTable() {
  noStore();
  try {
    const auctioneers = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            name: 'AUCTIONEER',
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
        auctioneerProfile: {
          select: {
            companyName: true,
            tempPassword: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return auctioneers.map(a => ({
        id: a.id,
        name: a.auctioneerProfile?.companyName ?? '',
        contact: `${a.firstName} ${a.lastName}`,
        email: a.email,
        status: a.status,
        createdAt: a.createdAt,
        tempPassword: a.auctioneerProfile?.tempPassword
    }))

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch auctioneers.');
  }
}


export async function getAuctioneerForEdit(userId: string) {
    noStore();
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                auctioneerProfile: true,
            }
        });
        if (!user || !user.auctioneerProfile) return null;

        return {
            id: user.id,
            name: user.auctioneerProfile.companyName,
            address: user.auctioneerProfile.address,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email
        };

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch auctioneer details.');
    }
}
