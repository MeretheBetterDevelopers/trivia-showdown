import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { AppHeader } from "@/src/components/AppHeader";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/trivia");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/trivia");
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 pt-20 pb-10">
      <AppHeader />
      <div className="flex w-full flex-1 flex-col items-center gap-6 text-center">
        {children}
      </div>
    </div>
  );
}
