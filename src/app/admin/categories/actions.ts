
'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/data/server-only';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
});

export async function addCategory(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
        where: { userId: user.id }
    });

    if (!auctioneerProfile) {
        return { success: false, message: 'Auctioneer profile not found.' };
    }

    const validatedFields = CategorySchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid category name.' };
    }
    
    const { name } = validatedFields.data;

    try {
        const existingCategory = await prisma.category.findFirst({
            where: { 
                name: { equals: name, mode: 'insensitive' },
                auctioneerId: auctioneerProfile.id
            },
        });

        if (existingCategory) {
            return { success: false, message: 'Category with this name already exists.' };
        }

        await prisma.category.create({
            data: { 
                name,
                auctioneerId: auctioneerProfile.id
            },
        });

        revalidatePath('/admin/categories');
        return { success: true, message: `Category "${name}" has been added.`};
    } catch (error) {
        return { success: false, message: 'Database error: Failed to add category.' };
    }
}

export async function updateCategory(id: string, name: string) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
        where: { userId: user.id }
    });

    if (!auctioneerProfile) {
        return { success: false, message: 'Auctioneer profile not found.' };
    }
    
    const validatedFields = CategorySchema.safeParse({ name });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid category name.' };
    }

    try {
        const categoryToUpdate = await prisma.category.findFirst({
            where: { id, auctioneerId: auctioneerProfile.id }
        });

        if (!categoryToUpdate) {
            return { success: false, message: 'Category not found or you do not have permission to edit it.' };
        }

        const existingCategory = await prisma.category.findFirst({
            where: { 
                name: { equals: name, mode: 'insensitive' },
                id: { not: id },
                auctioneerId: auctioneerProfile.id
            },
        });

        if (existingCategory) {
            return { success: false, message: 'Another category with this name already exists.' };
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name },
        });

        revalidatePath('/admin/categories');
        return { success: true, message: `Category updated to "${updatedCategory.name}".`, category: updatedCategory };
    } catch (error) {
        return { success: false, message: 'Database error: Failed to update category.' };
    }
}

export async function deleteCategory(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
        where: { userId: user.id }
    });

    if (!auctioneerProfile) {
        return { success: false, message: 'Auctioneer profile not found.' };
    }

    try {
        const categoryToDelete = await prisma.category.findFirst({
            where: { id, auctioneerId: auctioneerProfile.id }
        });

        if (!categoryToDelete) {
            return { success: false, message: 'Category not found or you do not have permission to delete it.' };
        }

        // First check if any auction items are using this category
        const itemsInCategory = await prisma.auctionItem.count({
            where: { categoryId: id },
        });

        if (itemsInCategory > 0) {
            return { success: false, message: 'Cannot delete category. It is currently being used by auction items.' };
        }

        await prisma.category.delete({
            where: { id },
        });
        revalidatePath('/admin/categories');
        return { success: true, message: 'Category deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Database error: Failed to delete category.' };
    }
}
