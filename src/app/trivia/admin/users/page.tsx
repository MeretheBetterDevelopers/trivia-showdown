import { prisma } from "@/src/lib/prisma";
import { setUserRole } from "../_actions/setUserRole";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { copy } from "@/src/lib/constants/copy";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-6">Manage roles</h1>
      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-card/60 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <form
              action={setUserRole.bind(null, user.id)}
              className="flex items-center gap-2"
            >
              <Select name="role" defaultValue={user.role}>
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="sm" variant="outline">
                {copy.common.save}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
