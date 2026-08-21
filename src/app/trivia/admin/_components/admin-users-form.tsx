"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setUserRole } from "../_actions/set-user-role";
import { resetUserPassword } from "../_actions/reset-user-password";
import { DeleteUserButton } from "./delete-user-button";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { copy } from "@/src/lib/constants/copy";
import { UserModel } from "@/src/generated/prisma/models";
import { Role } from "@/src/generated/prisma/enums";

type AdminUser = Pick<UserModel, "id" | "name" | "email" | "role">;

function generateTempPassword() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export function AdminUsersForm({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [isRolePending, startRoleTransition] = useTransition();
  const [isResetPending, startResetTransition] = useTransition();
  // Bumped on a failed role update to force the Select back to its
  // last-known value, since it isn't otherwise controlled.
  const [resetKey, setResetKey] = useState(0);

  function handleRoleChange(userId: string, role: Role) {
    startRoleTransition(async () => {
      try {
        await setUserRole(userId, role);
        toast.success(copy.admin.roleSavedMessage);
      } catch {
        toast.error(copy.admin.roleSaveErrorMessage);
        setResetKey((key) => key + 1);
      }
    });
  }

  function handleResetPassword(userId: string) {
    const confirmed = window.confirm(copy.admin.resetPasswordConfirmMessage);
    if (!confirmed) return;

    startResetTransition(async () => {
      try {
        const newPassword = generateTempPassword();
        await resetUserPassword(userId, newPassword);
        await navigator.clipboard.writeText(newPassword);
        toast.success(copy.admin.resetPasswordSuccessMessage);
      } catch {
        toast.error(copy.admin.resetPasswordErrorMessage);
      }
    });
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <ul className="flex w-full flex-col gap-2">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          return (
            <li
              key={user.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/30 bg-card/60 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
            >
              <div className="min-w-0 text-left">
                <p className="truncate font-medium">
                  {user.name}
                  {isCurrentUser && (
                    <span className="text-muted-foreground">
                      {" "}
                      {copy.roles.you}
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  key={`${user.role}-${resetKey}`}
                  defaultValue={user.role}
                  disabled={isCurrentUser || isRolePending}
                  onValueChange={(value) =>
                    handleRoleChange(user.id, value as Role)
                  }
                >
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">{copy.roles.member}</SelectItem>
                    <SelectItem value="ADMIN">{copy.roles.admin}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isCurrentUser || isResetPending}
                  onClick={() => handleResetPassword(user.id)}
                >
                  {copy.admin.resetPasswordButton}
                </Button>
                <DeleteUserButton
                  userId={user.id}
                  userName={user.name}
                  disabled={isCurrentUser}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
