'use server';

import prisma from '@/lib/prisma';
import { UserStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateUserStatus(userId: string, newStatus: UserStatus) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus },
        });
        
        revalidatePath('/admin/users');
        return { success: true, user: updatedUser };

    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, message: 'Failed to update user status.' };
    }
}

export async function bulkUpdateUserStatus(userIds: string[], newStatus: UserStatus) {
    try {
        const result = await prisma.user.updateMany({
            where: { 
                id: { in: userIds },
                // Optional: only update users that are not already in the new status
                // status: { not: newStatus }
            },
            data: { status: newStatus },
        });
        
        revalidatePath('/admin/users');
        return { success: true, count: result.count };

    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, message: 'Failed to perform bulk update.' };
    }
}
