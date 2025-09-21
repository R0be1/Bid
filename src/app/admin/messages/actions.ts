
'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/data/server-only';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { CommunicationChannel } from '@prisma/client';

const formSchema = z.object({
  name: z.string().min(1, 'Template name is required.'),
  channel: z.enum([CommunicationChannel.email, CommunicationChannel.sms], {
    required_error: 'Channel is required.',
  }),
  template: z.string().min(1, 'Template content is required.'),
});

export async function addMessageTemplateAction(values: unknown) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  const { name, channel, template } = validatedFields.data;

  try {
    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!auctioneerProfile) {
      return { success: false, message: 'Auctioneer profile not found.' };
    }

    const existingTemplate = await prisma.messageTemplate.findFirst({
        where: {
            name: {equals: name, mode: 'insensitive'},
            auctioneerId: auctioneerProfile.id
        }
    });

    if (existingTemplate) {
        return { success: false, message: "A template with this name already exists." };
    }

    await prisma.messageTemplate.create({
      data: {
        name,
        channel,
        template,
        auctioneerId: auctioneerProfile.id,
      },
    });

    revalidatePath('/admin/messages');
    return { success: true, message: `Template "${name}" has been created.` };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Database error: Failed to create template.',
    };
  }
}

export async function updateMessageTemplateAction(id: string, values: unknown) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid form data." };
  }

  const { name, channel, template } = validatedFields.data;

  try {
    const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!auctioneerProfile) {
      return { success: false, message: "Auctioneer profile not found." };
    }

    const templateToUpdate = await prisma.messageTemplate.findFirst({
      where: {
        id,
        auctioneerId: auctioneerProfile.id,
      },
    });

    if (!templateToUpdate) {
      return { success: false, message: "Template not found or you do not have permission to edit it." };
    }
    
    const existingTemplate = await prisma.messageTemplate.findFirst({
        where: {
            name: {equals: name, mode: 'insensitive'},
            auctioneerId: auctioneerProfile.id,
            id: { not: id }
        }
    });

    if (existingTemplate) {
        return { success: false, message: "Another template with this name already exists." };
    }


    await prisma.messageTemplate.update({
      where: { id },
      data: {
        name,
        channel,
        template,
      },
    });

    revalidatePath("/admin/messages");
    revalidatePath(`/admin/messages/${id}/edit`);
    return { success: true, message: "Template updated successfully." };
  } catch (error) {
    console.error("Database error: ", error);
    return { success: false, message: "Database error: Failed to update template." };
  }
}


export async function deleteMessageTemplateAction(templateId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
            where: { userId: user.id },
        });

        if (!auctioneerProfile) {
            return { success: false, message: 'Auctioneer profile not found.' };
        }

        // Verify the template belongs to the auctioneer before deleting
        const templateToDelete = await prisma.messageTemplate.findFirst({
            where: {
                id: templateId,
                auctioneerId: auctioneerProfile.id,
            }
        });

        if (!templateToDelete) {
            return { success: false, message: "Template not found or you don't have permission to delete it." };
        }

        await prisma.messageTemplate.delete({
            where: { id: templateId }
        });

        revalidatePath('/admin/messages');
        return { success: true, message: 'Template deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database error: Failed to delete template.' };
    }
}
