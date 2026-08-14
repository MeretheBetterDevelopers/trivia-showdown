import { signUp } from "../_actions/signUp";
import { AuthForm } from "../_components/AuthForm";

export default function SignUpPage() {
  return (
    <AuthForm
      action={signUp}
      title="Sign up"
      submitLabel="Sign up"
      pendingLabel="Signing up..."
      showNameField
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/sign-in"
    />
  );
}
