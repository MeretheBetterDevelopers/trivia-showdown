import { getCurrentSession } from "@/src/lib/auth";
import { WelcomeScreen } from "./_components/welcome-screen";
import { SignOutButton } from "./_components/sign-out-button";

export default async function Page() {
  const session = await getCurrentSession();
  const userRole = session?.user?.role;

  return (
    <WelcomeScreen
      isAdmin={userRole === "ADMIN"}
      signOutButton={<SignOutButton />}
    />
  );
}
