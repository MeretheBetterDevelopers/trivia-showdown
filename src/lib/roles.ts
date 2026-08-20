import { auth } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUserIfAdmin() {
  const session = await auth();
  const noSessionForUser = !session?.user?.id;
  if (noSessionForUser) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  return user?.role === "ADMIN" ? user : null;
}
