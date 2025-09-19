
'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const passwordSchema = z.string().min(8, "New password must be at least 8 characters.");

export async function forceChangePassword(userId: string, newPasswordValue: string): Promise<{ success: boolean; message: string; }> {
    const validatedPassword = passwordSchema.safeParse(newPasswordValue);

    if (!validatedPassword.success) {
        return { success: false, message: validatedPassword.error.errors[0]?.message || "Invalid password." };
    }
    
    const { data: newPassword } = validatedPassword;

    try {
        const dbUser = await prisma.user.findUnique({ 
            where: { id: userId },
            include: { auctioneerProfile: true }
         });

        if (!dbUser) {
            return { success: false, message: 'User not found.' };
        }
        
        if (!dbUser.auctioneerProfile?.tempPassword) {
            return { success: false, message: 'No temporary password found for this user. Cannot force change.' };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user password and clear temp password in one transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { 
                    password: hashedPassword,
                },
            }),
            prisma.auctioneerProfile.update({
                where: { id: dbUser.auctioneerProfile.id },
                data: { tempPassword: null }
            })
        ]);

        return { success: true, message: 'Password updated successfully! Please log in with your new password.' };

    } catch (error) {
        console.error("Force password change error:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
