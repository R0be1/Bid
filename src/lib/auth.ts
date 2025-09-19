
"use client";

import { parseCookies, destroyCookie } from 'nookies';
import type { IncomingMessage } from 'http';

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
