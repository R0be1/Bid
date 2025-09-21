
import { cookies } from "next/headers";
import type { AuthenticatedUser } from "@/lib/auth";

const SESSION_KEY = "user_session";

export async function GET() {
  const session = (await cookies()).get(SESSION_KEY)?.value;

  if (!session) {
    return new Response(JSON.stringify(null), { status: 200 });
  }

  try {
    const user: AuthenticatedUser = JSON.parse(session);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch {
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
