"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setUserRoles } from "../_actions/setUserRoles";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { copy } from "@/src/lib/constants/copy";
import { Role } from "@/src/generated/prisma/enums";
import { UserModel } from "@/src/generated/prisma/models";

type AdminUser = Pick<UserModel, "id" | "name" | "email" | "role">;

export function AdminUsersForm({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await setUserRoles(formData);
        toast.success(copy.admin.rolesSavedMessage);
      } catch {
        toast.error(copy.admin.rolesSaveErrorMessage);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col items-center gap-4"
    >
      <ul className="flex w-full flex-col gap-2">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          return (
            <li
              key={user.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-card/60 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
            >
              <div>
                <p className="font-medium">
                  {user.name}
                  {isCurrentUser && (
                    <span className="text-muted-foreground">
                      {" "}
                      {copy.roles.you}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Select
                key={user.role}
                name={`role-${user.id}`}
                defaultValue={user.role}
                disabled={isCurrentUser}
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">{copy.roles.member}</SelectItem>
                  <SelectItem value="ADMIN">{copy.roles.admin}</SelectItem>
                </SelectContent>
              </Select>
            </li>
          );
        })}
      </ul>
      <Button type="submit" disabled={isPending}>
        {isPending ? copy.common.saving : copy.common.save}
      </Button>
    </form>
  );
}
