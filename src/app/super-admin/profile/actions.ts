
'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

export async function getSuperAdminProfile() {
    const user = getCurrentUser();

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

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


export async function updatePassword(data: unknown) {
    const user = getCurrentUser();

    if (!user) {
        return { success: false, message: 'Authentication required.' };
    }
    
    const validatedFields = passwordSchema.safeParse(data);
    if (!validatedFields.success) {
        return { success: false, message: "Invalid form data." };
    }
    
    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

        if (!dbUser || !dbUser.password) {
            return { success: false, message: 'User not found.' };
        }

        const passwordsMatch = await bcrypt.compare(currentPassword, dbUser.password);
        if (!passwordsMatch) {
            return { success: false, message: 'Incorrect current password.' };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await prisma.user.update({
            where: { id: user.id },
            data: { 
                password: hashedPassword,
                // In a real app, you might want to clear the temp password after first change
                // tempPassword: null 
            },
        });

        revalidatePath('/super-admin/profile');
        return { success: true, message: 'Password updated successfully!' };

    } catch (error) {
        console.error("Password update error:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
