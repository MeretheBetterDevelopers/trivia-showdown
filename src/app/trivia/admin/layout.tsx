import { getCurrentAdmin } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { BackToHomeButton } from "@/src/components/BackToHomeButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/trivia");
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 pt-20 pb-10">
      <BackToHomeButton />
      <div className="flex w-full flex-1 flex-col items-center gap-6 text-center">
        {children}
      </div>
    </div>
  );
}
