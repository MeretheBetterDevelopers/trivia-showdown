import { getCurrentSession } from "./auth";

export async function getCurrentUserIfAdmin() {
  const session = await getCurrentSession();
  return session?.user?.role === "ADMIN"
    ? { id: session.user.id, role: session.user.role }
    : null;
}
