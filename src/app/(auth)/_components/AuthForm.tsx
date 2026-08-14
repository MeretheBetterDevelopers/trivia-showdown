"use client";

import Link from "next/link";
import { useRef } from "react";
import { X } from "lucide-react";
import { GameLogo } from "@/src/components/GameLogo";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useAuthForm } from "../_hooks/useAuthForm";
import { copy } from "@/src/lib/constants/copy";

type AuthFormState = { error: string | null };
type AuthFormAction = (
  prevState: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;

export function AuthForm({
  action,
  title,
  submitLabel,
  pendingLabel,
  showSignUpOptions = false,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: Readonly<{
  action: AuthFormAction;
  title: string;
  submitLabel: string;
  pendingLabel: string;
  showSignUpOptions?: boolean;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}>) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    previewUrl,
    isUploading,
    imageError,
    state,
    isPending,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
  } = useAuthForm(action);
  const imageInputRef = useRef<HTMLInputElement>(null);
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Card className="rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <GameLogo className="h-10 w-20" />
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {showSignUpOptions && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{copy.auth.signUp.nameLabel}</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{copy.auth.signUp.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{copy.auth.signUp.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {showSignUpOptions && (
            <div className="flex flex-col gap-1.5 items-center">
              <div className="relative">
                <label htmlFor="image" className="cursor-pointer">
                  <Avatar className="size-20">
                    <AvatarImage
                      src={previewUrl ?? undefined}
                      alt="Profile picture"
                    />
                    <AvatarFallback>{isUploading ? "…" : "+"}</AvatarFallback>
                  </Avatar>
                  <input
                    id="image"
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveImage();
                      if (imageInputRef.current) {
                        imageInputRef.current.value = "";
                      }
                    }}
                    aria-label="Remove image"
                    className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {imageError && (
            <p className="text-sm text-destructive">{imageError}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {/*TODO: not really working, check why*/}
            {isPending ? pendingLabel : submitLabel}{" "}
          </Button>
          <p className="text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-medium text-primary hover:underline"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
