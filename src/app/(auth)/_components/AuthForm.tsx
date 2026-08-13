"use client";

import Link from "next/link";
import { useActionState } from "react";
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
  showNameField = false,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: Readonly<{
  action: AuthFormAction;
  title: string;
  submitLabel: string;
  pendingLabel: string;
  showNameField?: boolean;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}>) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className="w-full max-w-md">
      <Card className="rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <GameLogo className="h-10 w-20" />
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {showNameField && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? pendingLabel : submitLabel}
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
