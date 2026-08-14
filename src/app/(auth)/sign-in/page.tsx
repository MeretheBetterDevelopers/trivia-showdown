import { signInAction } from "../_actions/signIn";
import { AuthForm } from "../_components/AuthForm";

export default function SignInPage() {
  return (
    <AuthForm
      action={signInAction}
      title="Sign in"
      submitLabel="Sign in"
      pendingLabel="Signing in..."
      footerText="Don't have an account?"
      footerLinkLabel="Sign up"
      footerLinkHref="/sign-up"
    />
  );
}
