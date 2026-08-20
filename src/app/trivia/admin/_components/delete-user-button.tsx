"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteUser } from "../_actions/delete-user";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { copy } from "@/src/lib/constants/copy";

export function DeleteUserButton({
  userId,
  userName,
  disabled = false,
}: {
  userId: string;
  userName: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmText, setConfirmText] = useState("");
  const nameMatches = confirmText === userName;

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success(copy.admin.userDeletedMessage);
      } catch {
        toast.error(copy.admin.userDeleteErrorMessage);
      }
    });
  }

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open) setConfirmText("");
      }}
    >
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm" disabled={isPending || disabled} />
        }
      >
        {copy.admin.deleteUserButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.admin.deleteUserConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.admin.deleteUserConfirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-name">{userName}</Label>
          <Input
            id="confirm-name"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={copy.admin.deleteUserConfirmPlaceholder}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{copy.common.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!nameMatches}
            onClick={handleDelete}
          >
            {copy.admin.deleteUserButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
