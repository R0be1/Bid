
import type { SuperAdmin } from './types';

// In a real application, this would be a database.
let superAdmins: SuperAdmin[] = [
    { id: 'sa-1', name: 'Super Admin', email: 'super@admin.com' },
];

export function getSuperAdmins(): SuperAdmin[] {
    return superAdmins;
}

export function addSuperAdmin({name, email}: {name: string, email: string}): SuperAdmin {
    const newAdmin: SuperAdmin = {
        id: `sa-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
    };
    superAdmins.push(newAdmin);
    return newAdmin;
}
