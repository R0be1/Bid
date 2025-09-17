
import type { User } from "./types";

// In a real application, this would be a database.
const users: User[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "approved", paidParticipation: true, paidDeposit: true },
    { id: "2", name: "Bob Williams", email: "bob@example.com", status: "pending", paidParticipation: false, paidDeposit: false },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "approved", paidParticipation: false, paidDeposit: false },
    { id: "4", name: "Diana Miller", email: "diana@example.com", status: "blocked", paidParticipation: true, paidDeposit: false },
    { id: "5", name: "Ethan Davis", email: "ethan@example.com", status: "pending", paidParticipation: true, paidDeposit: true },
];

export function getUsers(): User[] {
  return users;
}

export function getUser(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export function addUser(name: string, email: string): User {
    const newUser: User = {
        id: (users.length + 1).toString(),
        name,
        email,
        status: "pending",
        paidParticipation: false,
        paidDeposit: false,
    };
    users.push(newUser);
    return newUser;
}

export function updateUserStatus(id: string, status: User['status']): User | undefined {
    const user = users.find(u => u.id === id);
    if (user) {
        user.status = status;
        return user;
    }
    return undefined;
}

export function recordPayment(id: string, type: 'participation' | 'deposit'): User | undefined {
    const user = users.find(u => u.id === id);
    if (user) {
        if (type === 'participation') {
            user.paidParticipation = true;
        } else {
            user.paidDeposit = true;
        }
        // Auto-approve on payment
        if (user.status === 'pending') {
            user.status = 'approved';
        }
        return user;
    }
    return undefined;
}
