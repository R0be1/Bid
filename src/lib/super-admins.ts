
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
        id: `sa-${crypto.randomUUID()}`,
        name,
        email,
    };
    superAdmins.push(newAdmin);
    return newAdmin;
}
