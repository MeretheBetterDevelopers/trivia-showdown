import { getCurrentSession } from "@/src/lib/auth";
import { WelcomeScreen } from "./_components/welcome-screen";

export default async function Page() {
  const session = await getCurrentSession();
  const userRole = session?.user?.role;

  return <WelcomeScreen isAdmin={userRole === "ADMIN"} />;
}
