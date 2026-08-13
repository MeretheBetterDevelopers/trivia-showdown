import Link from "next/link";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { copy } from "@/src/lib/constants/copy";
import { GameLogo } from "./GameLogo";

export function AppHeader() {
  return (
    <>
      <Link
        href="/trivia"
        className="fixed top-4 left-4 z-10 font-heading text-2xl font-semibold"
      >
        <GameLogo className="inline-block w-20" />
      </Link>
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
    </>
  );
}
