
"use client";

import { parseCookies, destroyCookie } from 'nookies';

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

export const getCurrentUser = (): AuthenticatedUser | null => {
    const cookies = parseCookies();
    const session = cookies[SESSION_KEY];

    if (!session) return null;

    try {
        const user: AuthenticatedUser = JSON.parse(session);
        return user;
    } catch (e) {
        return null;
    }
}

export const isAuthenticated = (): boolean => {
    return !!getCurrentUser();
};
