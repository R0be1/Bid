
'use server';

import { cookies } from 'next/headers';
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

export function getCurrentUser(): AuthenticatedUser | null {
    const sessionCookie = cookies().get(SESSION_KEY);

    if (!sessionCookie) return null;

    try {
        const user: AuthenticatedUser = JSON.parse(sessionCookie.value);
        return user;
    } catch (e) {
        return null;
    }
}

export function getCurrentUserClient(): AuthenticatedUser | null {
    const clientCookies = parseCookies();
    const session = clientCookies[SESSION_KEY];

    if (!session) return null;

    try {
        const user: AuthenticatedUser = JSON.parse(session);
        return user;
    } catch (e) {
        return null;
    }
}


export async function logout() {
    cookies().delete(SESSION_KEY);
}
