

"use client";

import prisma from './prisma';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import type { IncomingMessage } from 'http';
import bcrypt from 'bcrypt';

export type UserRole = 'user' | 'admin' | 'super-admin';

export interface AuthenticatedUser {
    id: string;
    name: string;
    role: UserRole;
}

export interface AuthResult {
    success: boolean;
    message: string;
    role?: UserRole;
}


const SESSION_KEY = 'user_session';

export const login = async (phone: string, password: string): Promise<AuthResult> => {
    const user = await prisma.user.findUnique({
        where: { phone },
        include: { roles: true, auctioneerProfile: true }
    });

    if (!user) {
        return { success: false, message: "Invalid phone number or password." };
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch && password !== user.tempPassword) { // Also check against temp password
        return { success: false, message: "Invalid phone number or password." };
    }

    const roles = user.roles.map(r => r.name);
    let role: UserRole = 'user';
    let userName = `${user.firstName} ${user.lastName}`;

    if (roles.includes('SUPER_ADMIN')) {
        role = 'super-admin';
    } else if (roles.includes('AUCTIONEER')) {
        role = 'admin';
        if (user.auctioneerProfile?.companyName) {
            userName = user.auctioneerProfile.companyName;
        }
    } else if (roles.includes('BIDDER')) {
        role = 'user';
    }

    if (role === 'admin' && user.status !== 'APPROVED') {
      return { success: false, message: "Your auctioneer account is currently inactive. Please contact the administrator." };
    }


    const authenticatedUser: AuthenticatedUser = { id: user.id, name: userName, role: role };
    
    setCookie(null, SESSION_KEY, JSON.stringify(authenticatedUser), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    });

    return { success: true, message: `Welcome back, ${userName}!`, role: role };
}

export const logout = (): void => {
    destroyCookie(null, SESSION_KEY, { path: '/' });
};

export const getCurrentUser = (req?: IncomingMessage): AuthenticatedUser | null => {
    const cookies = parseCookies({ req });
    const session = cookies[SESSION_KEY];

    if (!session) return null;

    try {
        const user: AuthenticatedUser = JSON.parse(session);
        return user;
    } catch (e) {
        return null;
    }
}

export const isAuthenticated = (req?: IncomingMessage): boolean => {
    return !!getCurrentUser(req);
};
