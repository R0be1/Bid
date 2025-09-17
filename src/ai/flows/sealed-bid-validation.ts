'use server';

/**
 * @fileOverview Validates a sealed bid amount against a maximum allowed value using AI.
 *
 * - validateSealedBid - A function that validates the sealed bid amount.
 * - ValidateSealedBidInput - The input type for the validateSealedBid function.
 * - ValidateSealedBidOutput - The return type for the validateSealedBid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSealedBidInputSchema = z.object({
  bidAmount: z.number().describe('The amount of the bid.'),
  maxAllowedValue: z.number().describe('The maximum allowed value for the bid.'),
  itemDescription: z.string().describe('A description of the item being bid on.'),
});
export type ValidateSealedBidInput = z.infer<typeof ValidateSealedBidInputSchema>;

const ValidateSealedBidOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the bid amount is valid or not.'),
  reason: z.string().describe('The reason why the bid is valid or invalid.'),
});
export type ValidateSealedBidOutput = z.infer<typeof ValidateSealedBidOutputSchema>;

export async function validateSealedBid(input: ValidateSealedBidInput): Promise<ValidateSealedBidOutput> {
  return validateSealedBidFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateSealedBidPrompt',
  input: {schema: ValidateSealedBidInputSchema},
  output: {schema: ValidateSealedBidOutputSchema},
  prompt: `You are an expert in auction bidding validation.

You will receive the bid amount, the maximum allowed value, and a description of the item being bid on. Your task is to determine if the bid amount is valid, by being less than the max allowed value, and provide a reason for your determination.

Bid Amount: {{{bidAmount}}}
Max Allowed Value: {{{maxAllowedValue}}}
Item Description: {{{itemDescription}}}

Consider that there may be edge cases, such as currency mismatch. In such cases assume the bid is invalid.

Based on this information, determine if the bid is valid and provide a reason.
`,
});

const validateSealedBidFlow = ai.defineFlow(
  {
    name: 'validateSealedBidFlow',
    inputSchema: ValidateSealedBidInputSchema,
    outputSchema: ValidateSealedBidOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
