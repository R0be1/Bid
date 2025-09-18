
import type { Auctioneer } from "./types";
import { subDays } from "date-fns";

let auctioneers: Auctioneer[] = [
    {
        id: "auc-1",
        name: "Vintage Treasures LLC",
        address: "123 Antique Row, Collectorville, USA",
        status: "active",
        user: {
            firstName: "John",
            lastName: "Smith",
            phone: "111-222-3333",
            email: "john.smith@vintagetreasures.com",
            tempPassword: "password123"
        },
        createdAt: subDays(new Date(), 90),
    },
    {
        id: "auc-2",
        name: "Modern Art Auctions",
        address: "456 Gallery Ave, Metro City, USA",
        status: "active",
        user: {
            firstName: "Maria",
            lastName: "Garcia",
            phone: "444-555-6666",
            email: "maria.garcia@modernart.com",
            tempPassword: "password456"
        },
        createdAt: subDays(new Date(), 45),
    },
    {
        id: "auc-3",
        name: "Sports Memorabilia Kings",
        address: "789 Stadium Way, Champion Town, USA",
        status: "inactive",
        user: {
            firstName: "David",
            lastName: "Lee",
            phone: "777-888-9999",
            email: "david.lee@sportskings.com",
            tempPassword: "password789"
        },
        createdAt: subDays(new Date(), 120),
    }
];


export function getAuctioneers(): Auctioneer[] {
    return auctioneers;
}

export function getAuctioneerById(id: string): Auctioneer | undefined {
    return auctioneers.find(a => a.id === id);
}

export function addAuctioneer(data: Omit<Auctioneer, 'id' | 'createdAt' | 'status'>): Auctioneer {
    // In a real app, you'd generate a more secure random password.
    const tempPassword = Math.random().toString(36).slice(-8);
    const newAuctioneer: Auctioneer = {
        ...data,
        id: `auc-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        status: 'active',
        user: {
            ...data.user,
            tempPassword: tempPassword,
        }
    };
    auctioneers.push(newAuctioneer);
    return newAuctioneer;
}

export function updateAuctioneerStatus(id: string, status: 'active' | 'inactive'): Auctioneer | undefined {
    const auctioneer = auctioneers.find(a => a.id === id);
    if (auctioneer) {
        auctioneer.status = status;
        return auctioneer;
    }
    return undefined;
}

export function updateAuctioneer(id: string, data: Partial<Omit<Auctioneer, 'id' | 'createdAt' | 'status'>>): Auctioneer | undefined {
    const auctioneerIndex = auctioneers.findIndex(a => a.id === id);
    if (auctioneerIndex > -1) {
        const auctioneer = auctioneers[auctioneerIndex];
        
        const updatedUser = { ...auctioneer.user, ...data.user };
        const updatedAuctioneer: Auctioneer = {
            ...auctioneer,
            name: data.name ?? auctioneer.name,
            address: data.address ?? auctioneer.address,
            user: updatedUser,
        };

        auctioneers[auctioneerIndex] = updatedAuctioneer;
        return updatedAuctioneer;
    }
    return undefined;
}
