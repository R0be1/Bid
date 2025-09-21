
import type { UserStatus, PaymentMethod } from '@prisma/client';

export type UserRole = "user" | "admin" | "super-admin";

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: UserRole;
  status?: UserStatus;
  paidParticipation?: boolean;
  paidDeposit?: boolean;
  paymentMethod?: PaymentMethod | null;
}

export interface AuthResult {
  success: boolean;
  message: string;
  role?: UserRole;
  forcePasswordChange?: boolean;
  userId?: string;
}
