
import { getAuctioneers } from "./auctioneers";
import { getUsers } from "./users";
import { getSuperAdmins } from "./super-admins";

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

// In a real app, these tokens would be JWTs. Here we just mock them.
const MOCK_ACCESS_TOKEN = "mock-access-token-12345";
const MOCK_REFRESH_TOKEN = "mock-refresh-token-67890";

const SESSION_KEY = 'user_session';

// This would be your token validation and refresh logic in a real app
const getSession = (): { user: AuthenticatedUser, accessToken: string, refreshToken: string } | null => {
    if (typeof window === 'undefined') return null;
    const session = sessionStorage.getItem(SESSION_KEY);
    if (!session) return null;

    try {
        const { user, accessToken, refreshToken } = JSON.parse(session);
        // In a real app, you'd verify the accessToken here.
        // If expired, you'd use the refreshToken to get a new one.
        if (accessToken === MOCK_ACCESS_TOKEN) {
            return { user, accessToken, refreshToken };
        }
        return null;
    } catch (e) {
        return null;
    }
}

export const login = (phone: string, password: string): AuthResult => {
    const superAdmin = getSuperAdmins().find(sa => sa.email === 'super@admin.com'); // Special case for login
    if (superAdmin && phone === "0912345678" && password === "Admin@123") {
        const user: AuthenticatedUser = { id: superAdmin.id, name: superAdmin.name, role: 'super-admin' };
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ 
                user, 
                accessToken: MOCK_ACCESS_TOKEN, 
                refreshToken: MOCK_REFRESH_TOKEN 
            }));
        }
        return { success: true, message: `Welcome, ${superAdmin.name}!`, role: 'super-admin' };
    }

    const auctioneer = getAuctioneers().find(
      (a) => a.user.phone === phone && a.user.tempPassword === password
    );
    if (auctioneer) {
        const user: AuthenticatedUser = { id: auctioneer.id, name: auctioneer.user.firstName, role: 'admin' };
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ 
                user, 
                accessToken: MOCK_ACCESS_TOKEN, 
                refreshToken: MOCK_REFRESH_TOKEN 
            }));
        }
        return { success: true, message: `Welcome, ${auctioneer.name}.`, role: 'admin' };
    }
    
    const regularUser = getUsers().find(u => u.email.split('@')[0] === phone);
    if (regularUser && password === "password") {
       const user: AuthenticatedUser = { id: regularUser.id, name: regularUser.name, role: 'user' };
       if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ 
                user, 
                accessToken: MOCK_ACCESS_TOKEN, 
                refreshToken: MOCK_REFRESH_TOKEN 
            }));
        }
       return { success: true, message: `Welcome back, ${regularUser.name}!`, role: 'user' };
    }

    return { success: false, message: "Please check your phone number and password." };
}

export const logout = (): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
    }
};

export const getCurrentUser = (): AuthenticatedUser | null => {
    const session = getSession();
    return session ? session.user : null;
}

export const isAuthenticated = (): boolean => {
    return !!getSession();
};
