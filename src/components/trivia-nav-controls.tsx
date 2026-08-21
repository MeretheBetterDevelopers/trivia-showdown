import Link from "next/link";
import { ThemeToggle } from "@/src/app/theme/theme-toggle";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export function ThemeToggleCorner() {
  return (
    <div className="fixed top-4 right-4 z-10 hidden sm:block">
      <ThemeToggle />
    </div>
  );
}

export function BackToHomeButton() {
  return (
    <Button
      render={<Link href="/trivia" />}
      nativeButton={false}
      variant="outline"
      size="lg"
    >
      {copy.appHeader.backLabel}
    </Button>
  );
}
