import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { WelcomeScreen } from "./_components/WelcomeScreen";

export default async function Page() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      })
    : null;

  return <WelcomeScreen isAdmin={user?.role === "ADMIN"} />;
}
