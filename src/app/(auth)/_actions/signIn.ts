"use server";

import { z } from "zod";
import { signInWithCredentials } from "../_lib/signInWithCredentials";

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

  return signInWithCredentials(email, password, {
    invalidCredentials: "Invalid email or password",
    serverUnreachable: "Couldn't reach the server. Please try again shortly.",
  });
}
