
import type { SuperAdmin } from './types';

// In a real application, this would be a database.
let superAdmins: SuperAdmin[] = [
    { id: 'sa-1', name: 'Super Admin', email: 'super@admin.com', phone: '0912345678', tempPassword: 'Admin@123' },
];

export function getSuperAdmins(): SuperAdmin[] {
    return superAdmins;
}

export function addSuperAdmin({name, email, phone}: {name: string, email: string, phone: string}): SuperAdmin {
    const tempPassword = Math.random().toString(36).slice(-8);
    const newAdmin: SuperAdmin = {
        id: `sa-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        phone,
        tempPassword,
    };
    superAdmins.push(newAdmin);
    return newAdmin;
}
