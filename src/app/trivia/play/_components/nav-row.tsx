import { BackToHomeButton } from "@/src/components/trivia-nav-controls";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export function NavRow({
  onBackToModes,
}: Readonly<{ onBackToModes?: () => void }>) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {onBackToModes && (
        <Button onClick={onBackToModes} variant="outline" size="lg">
          {copy.trivia.backToModesButton}
        </Button>
      )}
      <BackToHomeButton />
    </div>
  );
}
