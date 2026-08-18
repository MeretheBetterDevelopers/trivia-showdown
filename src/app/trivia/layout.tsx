import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { SignOutButton } from "./_components/SignOutButton";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

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
