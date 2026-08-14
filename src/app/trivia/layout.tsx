import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "./_components/SignOutButton";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      {children}
      <SignOutButton />
    </>
  );
}
