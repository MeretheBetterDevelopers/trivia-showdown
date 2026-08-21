"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
import { Input } from "@/src/components/ui/input";
import categories from "@/src/lib/constants/categories.json";
import { copy } from "@/src/lib/constants/copy";
import {
  MAX_QUESTION_COUNT,
  MIN_QUESTION_COUNT,
  QUESTION_COUNT,
} from "@/src/lib/constants/game";
import { Difficulty } from "@/src/generated/prisma/enums";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: copy.admin.difficultyEasy,
  medium: copy.admin.difficultyMedium,
  hard: copy.admin.difficultyHard,
};

export type ReadyScreenSettings = {
  categoryNames: string[];
  difficulty?: Difficulty;
  questionCount: number;
};

export function ReadyScreen({
  onBegin,
  disabled = false,
}: Readonly<{
  onBegin: (settings: ReadyScreenSettings) => void;
  disabled?: boolean;
}>) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );
  const [questionCountInput, setQuestionCountInput] = useState(
    String(QUESTION_COUNT),
  );

  function toggleCategory(name: string) {
    setSelectedCategories((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  const parsedQuestionCount = Number(questionCountInput);
  const isQuestionCountValid =
    questionCountInput.trim() !== "" &&
    Number.isInteger(parsedQuestionCount) &&
    parsedQuestionCount >= MIN_QUESTION_COUNT &&
    parsedQuestionCount <= MAX_QUESTION_COUNT;

  return (
    <GlassCard className="text-center">
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
                variant={
                  selectedCategories.has(category.name) ? "default" : "outline"
                }
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={
                selectedCategories.has(copy.admin.noCategoryLabel)
                  ? "default"
                  : "outline"
              }
              onClick={() => toggleCategory(copy.admin.noCategoryLabel)}
            >
              {copy.admin.noCategoryLabel}
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">{copy.trivia.difficultyHeading}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={difficulty === undefined ? "default" : "outline"}
              onClick={() => setDifficulty(undefined)}
            >
              {copy.trivia.anyDifficultyLabel}
            </Button>
            {DIFFICULTIES.map((level) => (
              <Button
                key={level}
                type="button"
                size="sm"
                variant={difficulty === level ? "default" : "outline"}
                onClick={() => setDifficulty(level)}
              >
                {DIFFICULTY_LABELS[level]}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="question-count"
            className="text-sm font-medium"
          >
            {copy.trivia.questionCountLabel}
          </label>
          <Input
            id="question-count"
            type="number"
            min={MIN_QUESTION_COUNT}
            max={MAX_QUESTION_COUNT}
            value={questionCountInput}
            onChange={(event) => setQuestionCountInput(event.target.value)}
            aria-invalid={!isQuestionCountValid}
            className="w-24 text-center"
          />
          <p className="text-xs text-muted-foreground">
            {copy.trivia.questionCountHint}
          </p>
        </div>
        <Button
          onClick={() =>
            onBegin({
              categoryNames: [...selectedCategories],
              difficulty,
              questionCount: parsedQuestionCount,
            })
          }
          disabled={!isQuestionCountValid || disabled}
          size="lg"
          className="px-10 text-base"
        >
          {copy.trivia.beginButton}
        </Button>
      </CardContent>
    </GlassCard>
  );
}
