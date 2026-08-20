"use server";

import { auth } from "@/src/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { signUpSchema } from "@/src/lib/schemas/auth";

type SignUpState = { error: string | null };

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  // Validate the form data using the schema
  const result = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { name, email, password, imageUrl } = result.data;

  try {
    await auth.api.signUpEmail({
      body: { name, email, password, image: imageUrl ?? undefined },
    });
  } catch (error) {
    if (
      error instanceof APIError &&
      error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
    ) {
      return { error: "User already exists" };
    }
    return {
      error:
        "Couldn't reach the server to create your account. Please try again shortly.",
    };
  }

  redirect("/trivia");
}
