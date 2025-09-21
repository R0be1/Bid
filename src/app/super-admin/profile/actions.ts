
'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/data/server-only';

export async function getSuperAdminProfile() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'super-admin') {
        return null;
    }

    try {
        const admin = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
            },
        });

        if (!admin) return null;
        
        return {
            id: admin.id,
            name: `${admin.firstName} ${admin.lastName}`,
            email: admin.email,
            phone: admin.phone,
        };

    } catch (error) {
        console.error("Database Error:", error);
        return null;
    }
}
