import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { copy } from "@/src/lib/constants/copy";

export function AppHeader() {
  return (
    <>
      <Link
        href="/trivia"
        aria-label={copy.appHeader.backLabel}
        className="fixed top-4 left-4 z-10 flex items-center gap-1.5"
      >
        <ArrowLeft className="size-8 text-muted-foreground" aria-hidden />
      </Link>
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
    </>
  );
}
