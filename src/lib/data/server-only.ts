
import { cookies } from "next/headers";
import type { AuthenticatedUser } from "@/lib/auth";

const SESSION_KEY = "user_session";

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const sessionCookie = cookies().get(SESSION_KEY);

  if (!sessionCookie) return null;

  try {
    const user: AuthenticatedUser = JSON.parse(sessionCookie.value);
    return user;
  } catch (e) {
    return null;
  }
}
