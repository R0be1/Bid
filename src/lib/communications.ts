
import type { CommunicationLog } from "./types";

// In a real application, this would be a database.
let communications: CommunicationLog[] = [];

export function getCommunications(): CommunicationLog[] {
  return communications.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
}

export function addCommunicationLog(log: Omit<CommunicationLog, 'id'>): CommunicationLog {
    const newLog: CommunicationLog = {
        ...log,
        id: crypto.randomUUID(),
    };
    communications.push(newLog);
    return newLog;
}
