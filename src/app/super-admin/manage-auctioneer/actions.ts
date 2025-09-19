
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { UserStatus } from '@prisma/client';

const AuctioneerSchema = z.object({
  name: z.string().min(1, "Auctioneer name is required."),
  address: z.string().min(1, "Address is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Invalid email address."),
});

export async function registerAuctioneer(data: z.infer<typeof AuctioneerSchema>) {
  const validation = AuctioneerSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.message);
  }

  const { name, address, firstName, lastName, phone, email } = validation.data;

  // In a real app, you'd generate a more secure random password.
  const tempPassword = Math.random().toString(36).slice(-8);

  const auctioneerRole = await prisma.role.findUnique({
    where: { name: 'AUCTIONEER' },
  });

  if (!auctioneerRole) {
    throw new Error('Auctioneer role not found. Please seed roles first.');
  }

  await prisma.user.create({
    data: {
      phone,
      password: '', // Password will be set by the user on first login.
      firstName,
      lastName,
      email,
      status: UserStatus.APPROVED,
      roles: {
        connect: { id: auctioneerRole.id },
      },
      auctioneerProfile: {
        create: {
          companyName: name,
          address,
          tempPassword: tempPassword, // Storing plain temp password here
        },
      },
    },
  });

  revalidatePath('/super-admin/manage-auctioneer');
}

export async function updateAuctioneer(userId: string, data: z.infer<typeof AuctioneerSchema>) {
    const validation = AuctioneerSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.message);
    }
    const { name, address, firstName, lastName, phone, email } = validation.data;

    await prisma.user.update({
        where: { id: userId },
        data: {
            firstName,
            lastName,
            phone,
            email,
            auctioneerProfile: {
                update: {
                    companyName: name,
                    address,
                }
            }
        }
    });

    revalidatePath('/super-admin/manage-auctioneer');
    revalidatePath(`/super-admin/manage-auctioneer/${userId}/edit`);
}

export async function toggleAuctioneerStatus(userId: string, currentStatus: UserStatus) {
  const newStatus = currentStatus === UserStatus.APPROVED ? UserStatus.BLOCKED : UserStatus.APPROVED;

  await prisma.user.update({
    where: { id: userId },
    data: {
      status: newStatus,
    },
  });

  revalidatePath('/super-admin/manage-auctioneer');
}
