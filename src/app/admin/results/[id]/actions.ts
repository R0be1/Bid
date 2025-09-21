
"use server";

import { getCurrentUser } from "@/lib/data/server-only";
import { addCommunicationLog } from "@/lib/communications";
import type { CommunicationLog } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function announceResultsAction(
  logData: Omit<CommunicationLog, "id" | "auctioneerId">
): Promise<CommunicationLog> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const auctioneerProfile = await prisma.auctioneerProfile.findUnique({
    where: { userId: user.id },
  });
  if (!auctioneerProfile) throw new Error("Auctioneer profile not found");

  const newLog = await addCommunicationLog({
    ...logData,
    auctioneerId: auctioneerProfile.id,
  });

  return newLog;
}
