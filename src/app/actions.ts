"use server";

import { validateSealedBid, type ValidateSealedBidInput } from "@/ai/flows/sealed-bid-validation";
import { z } from "zod";
import { getAuctionItem } from "@/lib/data";

const BidSchema = z.object({
  bidAmount: z.coerce.number().positive("Bid amount must be positive."),
  itemId: z.string(),
});

export type FormState = {
  success: boolean;
  message: string;
};

export async function handleSealedBid(prevState: FormState, formData: FormData): Promise<FormState> {
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
  const item = getAuctionItem(itemId);

  if (!item || item.type !== "sealed" || !item.maxAllowedValue) {
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
      // In a real app, you would save the bid to the database here.
      console.log(`Bid of ${bidAmount} for ${item.name} is valid and has been recorded.`);
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
