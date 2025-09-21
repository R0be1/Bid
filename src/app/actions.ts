
"use server";

import { validateSealedBid, type ValidateSealedBidInput } from "@/ai/flows/sealed-bid-validation";
import { z } from "zod";
import { getAuctionItemForListing } from "@/lib/data/public";
import { logout as serverLogout, getCurrentUser } from "@/lib/data/server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const BidSchema = z.object({
  bidAmount: z.coerce.number().positive("Bid amount must be positive."),
  itemId: z.string(),
});

export type FormState = {
  success: boolean;
  message: string;
};

export async function handleSealedBid(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "You must be logged in to bid." };
  }

  const validatedFields = BidSchema.safeParse({
    bidAmount: formData.get("bidAmount"),
    itemId: formData.get("itemId"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const { bidAmount, itemId } = validatedFields.data;
  const item = await getAuctionItemForListing(itemId);

  if (!item || item.type !== "SEALED" || !item.maxAllowedValue) {
    return {
      success: false,
      message: "Invalid item for sealed bid.",
    };
  }
  
  try {
    const validationInput: ValidateSealedBidInput = {
      bidAmount,
      maxAllowedValue: item.maxAllowedValue,
      itemDescription: item.description,
    };
    
    const result = await validateSealedBid(validationInput);

    if (result.isValid) {
      await prisma.bid.create({
        data: {
          amount: bidAmount,
          auctionItemId: itemId,
          bidderId: user.id,
        },
      });

      revalidatePath(`/auctions/${itemId}`);
      
      return {
        success: true,
        message: "Your bid has been successfully submitted!",
      };
    } else {
      return {
        success: false,
        message: `Bid rejected: ${result.reason}`,
      };
    }
  } catch (error) {
    console.error("AI validation error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while validating your bid. Please try again.",
    };
  }
}


export async function logout() {
  await serverLogout();
}
