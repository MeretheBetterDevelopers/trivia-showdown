import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { SignOutButton } from "./_components/SignOutButton";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // JWT sessions are self-contained and don't hit the database on their own,
  // so a token stays "valid" even after its user row is deleted. Check on
  // every request so a deleted account gets thrown out immediately instead
  // of keeping access until the token naturally expires.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      {children}
      <SignOutButton />
    </>
  );
}
