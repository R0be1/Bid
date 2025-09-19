"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { AuthenticatedUser, UserRole, AuthResult } from "@/lib/auth";
import { cookies } from "next/headers";
import { UserStatus } from "@prisma/client";

const SESSION_KEY = "user_session";

export async function login(
  phone: string,
  password: string,
): Promise<AuthResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { phone },
      include: { roles: true, auctioneerProfile: true },
    });

    if (!user) {
      return { success: false, message: "Invalid phone number or password." };
    }

    const passwordMatch = user.password
      ? await bcrypt.compare(password, user.password)
      : false;
    const tempPasswordMatch =
      user.auctioneerProfile?.tempPassword &&
      user.auctioneerProfile.tempPassword === password;

    if (tempPasswordMatch) {
      return {
        success: true,
        message: "Temporary password verified.",
        forcePasswordChange: true,
        userId: user.id, // Pass userId for the next step
      };
    }

    if (!passwordMatch) {
      return { success: false, message: "Invalid phone number or password." };
    }

    const roles = user.roles.map((r) => r.name);
    let role: UserRole = "user"; // Default to user
    let userName = `${user.firstName} ${user.lastName}`;

    if (roles.includes("SUPER_ADMIN")) {
      role = "super-admin";
    } else if (roles.includes("AUCTIONEER")) {
      role = "admin";
      if (user.auctioneerProfile?.companyName) {
        userName = user.auctioneerProfile.companyName;
      }
    } else if (roles.includes("BIDDER")) {
      role = "user";
    }

    if (role === "admin" && user.status !== UserStatus.APPROVED) {
      return {
        success: false,
        message:
          "Your auctioneer account is currently inactive. Please contact the administrator.",
      };
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      name: userName,
      role: role,
    };

    (await cookies()).set(SESSION_KEY, JSON.stringify(authenticatedUser), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return {
      success: true,
      message: `Welcome back, ${userName}!`,
      role: role,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during login.",
    };
  }
}
