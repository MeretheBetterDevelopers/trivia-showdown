"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import categories from "@/src/lib/constants/categories.json";
import { copy } from "@/src/lib/constants/copy";

export function ReadyScreen({
  onBegin,
}: Readonly<{ onBegin: (categoryNames: string[]) => void }>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleCategory(name: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 text-center shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-4xl font-bold">
          {copy.trivia.readyHeading}
        </h2>
        <p className="text-muted-foreground">{copy.trivia.readyTagline}</p>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">{copy.trivia.categoriesHeading}</p>
          <p className="text-xs text-muted-foreground">
            {copy.trivia.categoriesHint}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.trivia_categories.map((category) => (
              <Button
                key={category.id}
                type="button"
                size="sm"
                variant={selected.has(category.name) ? "default" : "outline"}
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        <Button
          onClick={() => onBegin([...selected])}
          size="lg"
          className="px-10 text-base"
        >
          {copy.trivia.beginButton}
        </Button>
      </CardContent>
    </Card>
  );
}
