
import { parseCookies } from 'nookies';
import type { AuthenticatedUser } from './auth';

const SESSION_KEY = 'user_session';

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
