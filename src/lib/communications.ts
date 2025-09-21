
import type { CommunicationLog } from "./types";
import prisma from "./prisma";

export async function getCommunications(): Promise<CommunicationLog[]> {
    const comms = await prisma.communicationLog.findMany({
        orderBy: {
            sentAt: 'desc'
        }
    });

    return comms.map(c => ({
        id: c.id,
        auctionId: c.auctionId,
        auctionName: c.auctionName,
        templateName: c.templateName,
        channel: c.channel,
        recipientsCount: c.recipientsCount,
        sentAt: c.sentAt,
    }));
}

export async function addCommunicationLog(log: Omit<CommunicationLog, 'id'> & { auctioneerId: string }): Promise<CommunicationLog> {
    const newLog = await prisma.communicationLog.create({
        data: {
            auctionId: log.auctionId,
            auctionName: log.auctionName,
            templateName: log.templateName,
            channel: log.channel,
            recipientsCount: log.recipientsCount,
            sentAt: log.sentAt,
            auctioneerId: log.auctioneerId,
        }
    });

     return {
        id: newLog.id,
        auctionId: newLog.auctionId,
        auctionName: newLog.auctionName,
        templateName: newLog.templateName,
        channel: newLog.channel,
        recipientsCount: newLog.recipientsCount,
        sentAt: newLog.sentAt,
    };
}
