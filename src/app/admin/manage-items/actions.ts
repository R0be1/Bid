"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const imageSchema = z.object({
  url: z.string().url(),
  hint: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  startingPrice: z.coerce.number().positive(),
  type: z.enum(["LIVE", "SEALED"]),
  startDate: z.date(),
  endDate: z.date(),
  participationFee: z.coerce.number().min(0).optional(),
  securityDeposit: z.coerce.number().min(0).optional(),
  minIncrement: z.coerce.number().optional(),
  maxAllowedValue: z.coerce.number().optional(),
  images: z.array(imageSchema).min(1).max(3),
});

async function getAuctioneerProfile(userId: string) {
  // Fetch the auctioneer profile based on the user relation
  return prisma.auctioneerProfile.findFirst({
    where: { user: { id: userId } },
  });
}

export async function createAuctionItem(values: unknown) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const validated = formSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, message: "Invalid form data." };
  }

  const data = validated.data;

  if (data.startDate >= data.endDate) {
    return { success: false, message: "End date must be after start date." };
  }

  try {
    const auctioneerProfile = await getAuctioneerProfile(user.id);
    if (!auctioneerProfile) {
      return { success: false, message: "Auctioneer profile not found." };
    }

    await prisma.auctionItem.create({
      data: {
        name: data.name,
        description: data.description,
        startingPrice: data.startingPrice,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        minIncrement: data.minIncrement,
        maxAllowedValue: data.maxAllowedValue,
        participationFee: data.participationFee,
        securityDeposit: data.securityDeposit,
        categoryId: data.categoryId,
        auctioneerId: auctioneerProfile.id,
        images: {
          create: data.images.map((img) => ({
            url: img.url,
            hint: img.hint || "",
          })),
        },
      },
    });

    revalidatePath("/admin/manage-items");
    return { success: true, message: "Auction item created successfully." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Database error: Failed to create item.",
    };
  }
}

export async function updateAuctionItem(itemId: string, values: unknown) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const validated = formSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, message: "Invalid form data." };
  }

  const data = validated.data;

  if (data.startDate >= data.endDate) {
    return { success: false, message: "End date must be after start date." };
  }

  try {
    // Fetch item + auctioneer in one query to avoid separate lookups
    const item = await prisma.auctionItem.findFirst({
      where: {
        id: itemId,
        auctioneer: { user: { id: user.id } },
      },
      include: { images: true },
    });

    if (!item) {
      return { success: false, message: "Item not found or unauthorized." };
    }

    // Transaction: delete old images + update item
    await prisma.$transaction([
      prisma.image.deleteMany({ where: { auctionItemId: itemId } }),
      prisma.auctionItem.update({
        where: { id: itemId },
        data: {
          name: data.name,
          description: data.description,
          startingPrice: data.startingPrice,
          startDate: data.startDate,
          endDate: data.endDate,
          type: data.type,
          minIncrement: data.minIncrement,
          maxAllowedValue: data.maxAllowedValue,
          participationFee: data.participationFee,
          securityDeposit: data.securityDeposit,
          categoryId: data.categoryId,
          images: {
            create: data.images.map((img) => ({
              url: img.url,
              hint: img.hint || "",
            })),
          },
        },
      }),
    ]);

    revalidatePath("/admin/manage-items");
    revalidatePath(`/admin/manage-items/${itemId}/edit`);
    return { success: true, message: "Auction item updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Database error: Failed to update item.",
    };
  }
}

export async function deleteAuctionItem(itemId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const item = await prisma.auctionItem.findFirst({
      where: {
        id: itemId,
        auctioneer: { user: { id: user.id } },
      },
    });

    if (!item) {
      return { success: false, message: "Item not found or unauthorized." };
    }

    await prisma.auctionItem.delete({ where: { id: itemId } });
    revalidatePath("/admin/manage-items");

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Database error: Failed to delete item.",
    };
  }
}
