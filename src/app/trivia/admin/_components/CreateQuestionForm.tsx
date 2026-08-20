"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  questionSchema,
  QuestionInput,
  QuestionFormValues,
} from "@/src/lib/schemas/question";

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
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues, unknown, QuestionInput>({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
    defaultValues: {
      text: "",
      choices: ["", "", "", ""],
      difficulty: "medium",
    },
  });

  const onValid = handleSubmit((data) => {
    startTransition(async () => {
      let imageUrl: string | null = null;
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch {
          setImageError(
            "Couldn't upload image. Try again, or create the question without one.",
          );
          return;
        }
      }

      const formData = new FormData();
      formData.set("text", data.text);
      data.choices.forEach((choice) => formData.append("choices", choice));
      formData.set("correctAnswerIndex", String(data.correctAnswerIndex));
      if (data.category) formData.set("category", data.category);
      formData.set("difficulty", data.difficulty);
      if (imageUrl) formData.set("imageUrl", imageUrl);

      const result = await createQuestion({ error: null }, formData);
      setError(result.error);

      if (!result.error) {
        reset();
        handleRemoveImage();
      }
    });
  });

  return (
    <form
      onSubmit={onValid}
      className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-white/30 bg-card/60 p-6 text-left backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text">{copy.admin.questionTextLabel}</Label>
        <Input id="text" {...register("text")} />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{copy.admin.choicesLabel}</Label>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value={index}
                aria-label={`${copy.admin.correctAnswerLabel} ${index + 1}`}
                {...register("correctAnswerIndex", { valueAsNumber: true })}
              />
              <Input
                placeholder={`${copy.admin.choiceLabel} ${index + 1}`}
                {...register(`choices.${index}` as const)}
              />
            </div>
            {errors.choices?.[index] && (
              <p className="text-sm text-destructive">
                {errors.choices[index]?.message}
              </p>
            )}
          </div>
        ))}
        {errors.choices?.root?.message && (
          <p className="text-sm text-destructive">
            {errors.choices.root.message}
          </p>
        )}
        {errors.correctAnswerIndex && (
          <p className="text-sm text-destructive">
            {errors.correctAnswerIndex.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {copy.admin.correctAnswerHint}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">{copy.admin.categoryLabel}</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="difficulty">{copy.admin.difficultyLabel}</Label>
        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  {copy.admin.difficultyEasy}
                </SelectItem>
                <SelectItem value="medium">
                  {copy.admin.difficultyMedium}
                </SelectItem>
                <SelectItem value="hard">
                  {copy.admin.difficultyHard}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
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
          <div className="relative h-32 w-full">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              unoptimized
              className="rounded-lg object-cover"
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
        {imageError && <p className="text-sm text-destructive">{imageError}</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? copy.common.saving : copy.admin.createQuestionButton}
      </Button>
    </form>
  );
}
