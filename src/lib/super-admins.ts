
'use server';

import prisma from '@/lib/prisma';
import { UserStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getSuperAdmins() {
    const superAdmins = await prisma.user.findMany({
        where: {
            roles: {
                some: { name: 'SUPER_ADMIN' },
            },
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            auctioneerProfile: {
                select: {
                    tempPassword: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    return superAdmins.map(sa => ({
        id: sa.id,
        name: `${sa.firstName} ${sa.lastName}`,
        email: sa.email,
        phone: sa.phone,
        tempPassword: sa.auctioneerProfile?.tempPassword
    }));
}

export async function addSuperAdmin({name, email, phone}: {name: string, email: string, phone: string}) {
    const superAdminRole = await prisma.role.findUnique({
        where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
        throw new Error('SUPER_ADMIN role not found. Please seed the database.');
    }
    
    const tempPassword = Math.random().toString(36).slice(-8);

    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    await prisma.user.create({
        data: {
            phone,
            password: '', // Password will be set by the user on first login.
            firstName: firstName || 'Super',
            lastName: lastName || 'Admin',
            email,
            status: UserStatus.APPROVED,
            roles: {
                connect: { id: superAdminRole.id },
            },
            auctioneerProfile: {
                create: {
                    companyName: `${firstName} ${lastName}`,
                    address: 'N/A',
                    tempPassword: tempPassword,
                }
            }
        },
    });

    revalidatePath('/super-admin/settings');
}
