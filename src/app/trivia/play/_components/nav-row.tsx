"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

type LeaveTarget = "modes" | "home";

export function NavRow({
  onBackToModes,
  confirmLeave,
}: Readonly<{
  onBackToModes?: () => void;
  // True while a question is currently on screen and unanswered - leaving
  // now would abandon it, so clicking away should confirm first instead
  // of navigating immediately.
  confirmLeave?: boolean;
}>) {
  const router = useRouter();
  const [pendingLeave, setPendingLeave] = useState<LeaveTarget | null>(null);

  function leave(target: LeaveTarget) {
    if (target === "modes") {
      onBackToModes?.();
    } else {
      router.push("/trivia");
    }
  }

  function handleClick(target: LeaveTarget) {
    if (confirmLeave) {
      setPendingLeave(target);
      return;
    }
    leave(target);
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        {onBackToModes && (
          <Button
            onClick={() => handleClick("modes")}
            variant="outline"
            size="lg"
          >
            {copy.trivia.backToModesButton}
          </Button>
        )}
        <Button onClick={() => handleClick("home")} variant="outline" size="lg">
          {copy.appHeader.backLabel}
        </Button>
      </div>

      {/* Uncontrolled by isAnswered/timer state on purpose - opening this
          dialog must not pause the countdown, so it stays a plain overlay
          on top of whatever's already running underneath. */}
      <AlertDialog
        open={pendingLeave !== null}
        onOpenChange={(open) => {
          if (!open) setPendingLeave(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.trivia.leaveConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.trivia.leaveConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingLeave) leave(pendingLeave);
                setPendingLeave(null);
              }}
            >
              {copy.trivia.leaveConfirmButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
