

// This file is no longer used for data manipulation and can be considered deprecated.
// All template management logic has been moved to server actions in 
// src/app/admin/messages/actions.ts
// and data fetching is done in src/lib/data/admin.ts

import type { MessageTemplate } from "./types";

// In a real application, this would be a database.
let messageTemplates: MessageTemplate[] = [
    { 
        id: "1", 
        name: "Auction Winner Notification", 
        channel: "email", 
        template: "Congratulations {winnerName}! You have won the auction for {itemName} with a final bid of {winningBid} Birr. Please proceed to payment within 48 hours." 
    },
    { 
        id: "2", 
        name: "Outbid Notification", 
        channel: "sms", 
        template: "Hi {userName}, you have been outbid on {itemName}. The current bid is now {currentBid} Birr. Place a new bid to stay in the auction!" 
    },
    { 
        id: "3", 
        name: "Auction Ending Soon", 
        channel: "email", 
        template: "The auction for {itemName} is ending in one hour! The current bid is {currentBid} Birr. Don't miss your chance to win." 
    },
];

export function getMessageTemplates(): MessageTemplate[] {
  return messageTemplates;
}

export function addMessageTemplate(name: string, channel: 'email' | 'sms', template: string): MessageTemplate {
    if (messageTemplates.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("A template with this name already exists.");
    }
    const newTemplate: MessageTemplate = {
        id: (Math.max(0, ...messageTemplates.map(t => parseInt(t.id))) + 1).toString(),
        name,
        channel,
        template,
    };
    messageTemplates.push(newTemplate);
    return newTemplate;
}

export function updateMessageTemplate(id: string, name: string, channel: 'email' | 'sms', template: string): MessageTemplate | undefined {
    const templateToUpdate = messageTemplates.find(t => t.id === id);
    if (templateToUpdate) {
        if (messageTemplates.some(t => t.id !== id && t.name.toLowerCase() === name.toLowerCase())) {
            throw new Error("Another template with this name already exists.");
        }
        templateToUpdate.name = name;
        templateToUpdate.channel = channel;
        templateToUpdate.template = template;
        return templateToUpdate;
    }
    return undefined;
}

export function deleteMessageTemplate(id: string): void {
    const index = messageTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
        messageTemplates.splice(index, 1);
    } else {
        throw new Error("Message template not found.");
    }
}
