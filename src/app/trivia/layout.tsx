import { getCurrentSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "./_components/SignOutButton";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <>
      {children}
      <SignOutButton />
    </>
  );
}
