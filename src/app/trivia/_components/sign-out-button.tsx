import { LogOut } from "lucide-react";
import { signOutAction } from "../_actions/sign-out";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export function SignOutButton() {
  return (
    <form action={signOutAction} className="fixed bottom-4 right-4 z-10">
      <Button type="submit" variant="outline" size="sm">
        <LogOut className="size-4" />
        {copy.auth.signOutButton}
      </Button>
    </form>
  );
}
