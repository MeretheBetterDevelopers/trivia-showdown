import Link from "next/link";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { copy } from "@/src/lib/constants/copy";

export function AppHeader() {
  return (
    <div className="flex w-full max-w-2xl items-center justify-between">
      <Link href="/trivia" className="font-heading text-2xl font-semibold">
        {copy.appName}
      </Link>
      <ThemeToggle />
    </div>
  );
}
