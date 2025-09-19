
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
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
            tempPassword: true,
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
        tempPassword: sa.tempPassword
    }));
}

export async function addSuperAdmin({name, email, phone}: {name: string, email: string, phone: string}) {
    const superAdminRole = await prisma.role.findUnique({
        where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
        throw new Error('SUPER_ADMIN role not found. Please seed the database.');
    }
    
    // In a real app, you'd generate a more secure random password.
    const tempPassword = Math.random().toString(36).slice(-8);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    await prisma.user.create({
        data: {
            phone,
            password: hashedPassword,
            tempPassword,
            firstName: firstName || 'Super',
            lastName: lastName || 'Admin',
            email,
            status: UserStatus.APPROVED,
            roles: {
                connect: { id: superAdminRole.id },
            },
        },
    });

    revalidatePath('/super-admin/settings');
}
