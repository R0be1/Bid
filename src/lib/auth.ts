import { cookies } from "next/headers";
import type { UserStatus, PaymentMethod } from '@prisma/client';

export type UserRole = "user" | "admin" | "super-admin";

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  paidParticipation: boolean;
  paidDeposit: boolean;
  paymentMethod?: PaymentMethod | null;
}

export interface AuthResult {
  success: boolean;
  message: string;
  role?: UserRole;
  forcePasswordChange?: boolean;
  userId?: string;
}

const SESSION_KEY = "user_session";

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const sessionCookie = (await cookies()).get(SESSION_KEY);

  if (!sessionCookie) return null;

  try {
    const user: AuthenticatedUser = JSON.parse(sessionCookie.value);
    return user;
  } catch (e) {
    return null;
  }
}

export async function logout() {
  (await cookies()).delete(SESSION_KEY);
}
