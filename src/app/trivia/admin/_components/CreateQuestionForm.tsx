"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createQuestion } from "../_actions/createQuestion";
import { uploadImage } from "@/src/app/services/cloudinary";
import { useImagePicker } from "@/src/hooks/useImagePicker";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { copy } from "@/src/lib/constants/copy";
import categories from "@/src/lib/constants/categories.json";

export function CreateQuestionForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    imageFile,
    previewUrl,
    imageError,
    setImageError,
    inputRef,
    handleImageChange,
    handleRemoveImage,
  } = useImagePicker();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      if (imageFile) {
        try {
          formData.set("imageUrl", await uploadImage(imageFile));
        } catch {
          setImageError(
            "Couldn't upload image. Try again, or create the question without one.",
          );
          return;
        }
      }

      const result = await createQuestion({ error: null }, formData);
      setError(result.error);

      if (!result.error) {
        form.reset();
        handleRemoveImage();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-white/30 bg-card/60 p-6 text-left backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text">{copy.admin.questionTextLabel}</Label>
        <Input id="text" name="text" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{copy.admin.choicesLabel}</Label>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="correctAnswerIndex"
              value={index}
              defaultChecked={index === 0}
              aria-label={`${copy.admin.correctAnswerLabel} ${index + 1}`}
            />
            <Input
              name="choices"
              placeholder={`${copy.admin.choiceLabel} ${index + 1}`}
              required
            />
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          {copy.admin.correctAnswerHint}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">{copy.admin.categoryLabel}</Label>
        <Select name="category">
          <SelectTrigger id="category">
            <SelectValue placeholder={copy.admin.categoryPlaceholder} />
          </SelectTrigger>
          <SelectContent className="w-max">
            {categories.trivia_categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="difficulty">{copy.admin.difficultyLabel}</Label>
        <Select name="difficulty" defaultValue="medium">
          <SelectTrigger id="difficulty">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">{copy.admin.difficultyEasy}</SelectItem>
            <SelectItem value="medium">
              {copy.admin.difficultyMedium}
            </SelectItem>
            <SelectItem value="hard">{copy.admin.difficultyHard}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image">{copy.admin.imageLabel}</Label>
        <Input
          id="image"
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewUrl && (
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remove image"
              className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        {imageError && (
          <p className="text-sm text-destructive">{imageError}</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? copy.common.saving : copy.admin.createQuestionButton}
      </Button>
    </form>
  );
}
