"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { UserStatus } from "@prisma/client";

const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type RegisterFormState = {
  success: boolean;
  message: string;
};

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const validatedFields = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors[0]?.message || "Invalid form data.",
    };
  }

  const { firstName, lastName, email, phone, password } = validatedFields.data;

  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone },
    });
    if (existingUserByPhone) {
      return {
        success: false,
        message: "An account with this phone number already exists.",
      };
    }

    const bidderRole = await prisma.role.findUnique({
      where: { name: "BIDDER" },
    });

    if (!bidderRole) {
      console.error("BIDDER role not found. Please seed the database.");
      return {
        success: false,
        message: "A system error occurred. Please try again later.",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        status: UserStatus.PENDING,
        roles: {
          connect: { id: bidderRole.id },
        },
      },
    });

    return {
      success: true,
      message: `Welcome, ${firstName}! Your account is pending admin approval.`,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
