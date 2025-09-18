
import { getAuctioneers } from "./auctioneers";
import { getUsers } from "./users";
import { getSuperAdmins } from "./super-admins";
import { parseCookies, setCookie, destroyCookie } from 'nookies';
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

export const login = (phone: string, password: string): AuthResult => {
    const superAdmin = getSuperAdmins().find(sa => sa.email === 'super@admin.com'); // Special case for login
    if (superAdmin && phone === "0912345678" && password === "Admin@123") {
        const user: AuthenticatedUser = { id: superAdmin.id, name: superAdmin.name, role: 'super-admin' };
        
        setCookie(null, SESSION_KEY, JSON.stringify(user), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

        return { success: true, message: `Welcome, ${superAdmin.name}!`, role: 'super-admin' };
    }

    const auctioneer = getAuctioneers().find(
      (a) => a.user.phone === phone && a.user.tempPassword === password
    );
    if (auctioneer) {
        const user: AuthenticatedUser = { id: auctioneer.id, name: auctioneer.user.firstName, role: 'admin' };
        
        setCookie(null, SESSION_KEY, JSON.stringify(user), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

        return { success: true, message: `Welcome, ${auctioneer.name}.`, role: 'admin' };
    }
    
    const regularUser = getUsers().find(u => u.email.split('@')[0] === phone);
    if (regularUser && password === "password") {
       const user: AuthenticatedUser = { id: regularUser.id, name: regularUser.name, role: 'user' };
       
        setCookie(null, SESSION_KEY, JSON.stringify(user), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

       return { success: true, message: `Welcome back, ${regularUser.name}!`, role: 'user' };
    }

    return { success: false, message: "Please check your phone number and password." };
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

