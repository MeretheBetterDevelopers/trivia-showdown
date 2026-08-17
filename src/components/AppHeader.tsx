import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { copy } from "@/src/lib/constants/copy";

export function AppHeader() {
  return (
    <>
      <Link
        href="/trivia"
        className="fixed top-4 left-4 z-10 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {copy.appHeader.backLabel}
      </Link>
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
    </>
  );
}
