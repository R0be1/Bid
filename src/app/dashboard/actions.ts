
"use server";

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { User, AuctionItemFee, PaymentType } from '@/lib/types';
import { UserStatus, PaymentMethod } from '@prisma/client';

export type DashboardData = {
  user: User;
  feeItems: AuctionItemFee[];
};

type ActionResult<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function getDashboardData(): Promise<ActionResult<DashboardData>> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'user') {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return { success: false, message: 'User not found.' };
    }

    const userForClient: User = {
      id: dbUser.id,
      name: `${dbUser.firstName} ${dbUser.lastName}`,
      email: dbUser.email,
      phone: dbUser.phone,
      status: dbUser.status,
      paidParticipation: dbUser.paidParticipation,
      paidDeposit: dbUser.paidDeposit,
      paymentMethod: dbUser.paymentMethod,
      receiptUrl: dbUser.receiptUrl,
    };

    const feeItems = await prisma.auctionItem.findMany({
      where: {
        endDate: { gt: new Date() }, // Only show for active/upcoming auctions
        OR: [
          { 
            participationFee: { gt: 0 },
            // User has NOT paid participation fee
            NOT: { paidParticipationUsers: { some: { id: user.id } } }
          },
          { 
            securityDeposit: { gt: 0 },
            // User has NOT paid security deposit
            NOT: { paidDepositUsers: { some: { id: user.id } } }
          },
        ],
      },
      select: {
        id: true,
        name: true,
        participationFee: true,
        securityDeposit: true,
      },
    });

    return {
      success: true,
      message: 'Data fetched successfully',
      data: { user: userForClient, feeItems },
    };
  } catch (error) {
    console.error('getDashboardData error:', error);
    return { success: false, message: 'Failed to fetch dashboard data.' };
  }
}

export async function recordPaymentAction(
  paymentType: PaymentType,
  method: 'direct' | 'receipt',
  receiptUrl?: string,
): Promise<ActionResult<User>> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'user') {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!currentUser) return { success: false, message: 'User not found.' };

    const updateData: {
      paidParticipation?: boolean;
      paidDeposit?: boolean;
      paymentMethod?: PaymentMethod;
      status?: UserStatus;
      receiptUrl?: string;
    } = {
      paymentMethod:
        method === 'direct' ? PaymentMethod.DIRECT : PaymentMethod.RECEIPT,
    };

    if (paymentType === 'participation') {
      updateData.paidParticipation = true;
    } else {
      updateData.paidDeposit = true;
    }

    if (method === 'direct') {
      if (currentUser.status === 'PENDING') {
        updateData.status = UserStatus.APPROVED;
      }
    } else {
      updateData.receiptUrl = receiptUrl || '/receipt-placeholder.pdf';
      if (currentUser.status === 'APPROVED') {
        updateData.status = UserStatus.PENDING; // Back to pending for verification
      }
    }

    const updatedDbUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const userForClient: User = {
      id: updatedDbUser.id,
      name: `${updatedDbUser.firstName} ${updatedDbUser.lastName}`,
      email: updatedDbUser.email,
      phone: updatedDbUser.phone,
      status: updatedDbUser.status,
      paidParticipation: updatedDbUser.paidParticipation,
      paidDeposit: updatedDbUser.paidDeposit,
      paymentMethod: updatedDbUser.paymentMethod,
      receiptUrl: updatedDbUser.receiptUrl,
    };

    revalidatePath('/dashboard');

    return {
      success: true,
      message:
        method === 'direct'
          ? `Payment for ${paymentType} successful. Your account is approved.`
          : `Receipt for ${paymentType} submitted for review.`,
      data: userForClient,
    };
  } catch (error) {
    console.error('recordPaymentAction error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while recording payment.',
    };
  }
}
