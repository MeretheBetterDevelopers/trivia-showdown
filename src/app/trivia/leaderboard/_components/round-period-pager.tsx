import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function RoundPeriodPager({
  label,
  prevHref,
  nextHref,
}: Readonly<{
  label: string;
  prevHref: string;
  nextHref: string | null;
}>) {
  return (
    <div className="flex items-center gap-2">
      <Button
        render={<Link href={prevHref} />}
        nativeButton={false}
        variant="outline"
        size="sm"
        aria-label="Previous period"
      >
        <ChevronLeft className="size-3.5" aria-hidden />
      </Button>
      <span className="text-sm font-medium">{label}</span>
      {nextHref ? (
        <Button
          render={<Link href={nextHref} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          aria-label="Next period"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </Button>
      ) : (
        <Button
          disabled
          variant="outline"
          size="sm"
          aria-label="Next period"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </Button>
      )}
    </div>
  );
}
