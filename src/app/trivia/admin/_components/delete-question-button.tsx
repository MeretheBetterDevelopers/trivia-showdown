"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteQuestion } from "../_actions/delete-question";
import { Button } from "@/src/components/ui/button";
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

export function DeleteQuestionButton({
  questionId,
}: Readonly<{ questionId: string }>) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteQuestion(questionId);
        toast.success(copy.admin.questionDeletedMessage);
      } catch {
        toast.error(copy.admin.questionDeleteErrorMessage);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline" size="sm" disabled={isPending} />}
      >
        {copy.common.delete}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {copy.admin.deleteQuestionConfirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {copy.admin.deleteQuestionConfirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {copy.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? copy.common.saving : copy.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
