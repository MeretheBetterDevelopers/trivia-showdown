import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export function ErrorRetry({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-destructive">{message}</p>
      <Button onClick={onRetry} variant="outline">
        {copy.trivia.retryButton}
      </Button>
    </div>
  );
}
