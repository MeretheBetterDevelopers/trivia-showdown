import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { redirect } from "next/navigation";
import {
  BackToHomeButton,
  ThemeToggleCorner,
} from "@/src/components/trivia-nav-controls";
import { SignOutButton } from "../_components/sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentUserIfAdmin();
  if (!admin) {
    redirect("/trivia");
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 pt-10 pb-16 sm:pb-10">
      <ThemeToggleCorner />
      <div className="flex w-full flex-col items-center gap-6 text-center">
        {children}
      </div>
      <BackToHomeButton />
      <div className="hidden sm:block">
        <SignOutButton />
      </div>
    </div>
  );
}
