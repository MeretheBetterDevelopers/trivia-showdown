import { signIn } from "@/src/lib/auth";
import { redirect } from "next/navigation";

type SignInMessages = {
  invalidCredentials: string;
  serverUnreachable: string;
};

// signIn() throws on failure rather than returning an error result, and
// returns a plain URL string (not an object) on success. A wrong email or
// password throws "CredentialsSignin"; anything else (e.g. authorize()
// itself throwing because the database is unreachable) throws a different
// error type, so it needs a different message.
export async function signInWithCredentials(
  email: string,
  password: string,
  messages: SignInMessages,
): Promise<{ error: string }> {
  try {
    await signIn("credentials", { redirect: false, email, password });
  } catch (error) {
    if (error instanceof Error && error.name === "CredentialsSignin") {
      return { error: messages.invalidCredentials };
    }
    return { error: messages.serverUnreachable };
  }

  redirect("/trivia");
}
