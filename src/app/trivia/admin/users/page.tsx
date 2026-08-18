import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { AdminUsersForm } from "../_components/AdminUsersForm";
import { copy } from "@/src/lib/constants/copy";

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([
    auth(),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true },
    }),
  ]);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div>
        <p>{copy.admin.noIdFound}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <h1 className="font-heading text-3xl font-bold">
        {copy.admin.manageRolesHeading}
      </h1>

      <AdminUsersForm users={users} currentUserId={userId} />
    </div>
  );
}
