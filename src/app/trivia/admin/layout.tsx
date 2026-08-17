import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/trivia");
  }

  return <>{children}</>;
}
