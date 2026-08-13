import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Spinner } from "@/src/components/ui/spinner";

export function QuestionCardSkeleton() {
  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="size-2 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
