import { auth } from "@/src/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

type SignInMessages = {
  invalidCredentials: string;
  serverUnreachable: string;
};

export async function signInWithCredentials(
  email: string,
  password: string,
  messages: SignInMessages,
): Promise<{ error: string }> {
  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    if (
      error instanceof APIError &&
      error.body?.code === "INVALID_EMAIL_OR_PASSWORD"
    ) {
      return { error: messages.invalidCredentials };
    }
    return { error: messages.serverUnreachable };
  }

  redirect("/trivia");
}
