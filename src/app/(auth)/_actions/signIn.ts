"use server";

import { z } from "zod";
import { signIn } from "@/src/lib/auth";
import { redirect } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInState = { error: string | null };

export async function signInAction(
  prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  // Validate the form data using the schema
  const result = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message ?? "Invalid form data" };
  }

  const { email, password } = result.data;

  // Attempt to sign in the user.
  // signIn() throws on failure rather than returning an error result, and
  // returns a plain URL string (not an object) on success. A wrong email or
  // password throws "CredentialsSignin"; anything else (e.g. authorize()
  // itself throwing because the database is unreachable) throws a different
  // error type, so it needs a different message.
  try {
    await signIn("credentials", { redirect: false, email, password });
  } catch (error) {
    if (error instanceof Error && error.name === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }
    return {
      error: "Couldn't reach the server. Please try again shortly.",
    };
  }

  redirect("/trivia");
}
