import type { AuthenticatedUser } from "./auth";

export async function getCurrentUserClient(): Promise<AuthenticatedUser | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
