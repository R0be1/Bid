
'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

export type UserProfileData = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

type ActionResult<T> = {
  success: boolean;
  message: string;
  data?: T;
};


export async function getUserProfile(): Promise<ActionResult<UserProfileData>> {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, message: 'Authentication required.' };
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
            },
        });

        if (!dbUser) {
            return { success: false, message: 'User not found.' };
        }

        const profileData: UserProfileData = {
            id: dbUser.id,
            name: `${dbUser.firstName} ${dbUser.lastName}`,
            email: dbUser.email,
            phone: dbUser.phone,
        };

        return { success: true, message: 'Profile fetched.', data: profileData };

    } catch (error) {
        console.error("getUserProfile Error:", error);
        return { success: false, message: 'Failed to fetch user profile.' };
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


export async function updateUserPassword(data: unknown): Promise<{ success: boolean; message: string; }> {
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

        if (!dbUser) {
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
                tempPassword: null, // Clear temp password after a successful change
            },
        });

        revalidatePath('/profile');
        revalidatePath('/admin/profile');
        revalidatePath('/super-admin/profile');

        return { success: true, message: 'Password updated successfully!' };

    } catch (error) {
        console.error("Password update error:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
