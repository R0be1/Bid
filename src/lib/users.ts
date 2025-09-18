
import type { User } from "./types";

// In a real application, this would be a database.
const users: User[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "approved", paidParticipation: true, paidDeposit: true, paymentMethod: 'direct' },
    { id: "2", name: "Bob Williams", email: "bob@example.com", status: "pending", paidParticipation: false, paidDeposit: false },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "approved", paidParticipation: false, paidDeposit: false },
    { id: "4", name: "Diana Miller", email: "diana@example.com", status: "blocked", paidParticipation: true, paidDeposit: false, paymentMethod: 'receipt', receiptUrl: '/receipt-placeholder.pdf' },
    { id: "5", name: "Ethan Davis", email: "ethan@example.com", status: "pending", paidParticipation: true, paidDeposit: true, paymentMethod: 'receipt', receiptUrl: '/receipt-placeholder.pdf' },
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

export function recordPayment(id: string, type: 'participation' | 'deposit', method: 'direct' | 'receipt' = 'direct', receiptUrl?: string): User | undefined {
    const user = users.find(u => u.id === id);
    if (user) {
        if (type === 'participation') {
            user.paidParticipation = true;
        } else {
            user.paidDeposit = true;
        }
        
        user.paymentMethod = method;

        if (method === 'direct') {
            // Auto-approve on direct payment
            if (user.status === 'pending') {
                user.status = 'approved';
            }
        } else {
            // Keep status as pending for receipt upload, requires admin approval
            user.receiptUrl = receiptUrl || '/receipt-placeholder.pdf';
             if (user.status === 'approved') {
               // if they were somehow approved before, move back to pending
               user.status = 'pending';
             }
        }
        
        return user;
    }
    return undefined;
}
