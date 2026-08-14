import { signUp } from "../_actions/signUp";
import { AuthForm } from "../_components/AuthForm";
import { copy } from "@/src/lib/constants/copy";

export default function SignUpPage() {
  return (
    <AuthForm
      action={signUp}
      title={copy.auth.signUp.heading}
      submitLabel={copy.auth.signUp.submitButton}
      pendingLabel={copy.auth.signUp.pendingButton}
      showSignUpOptions
      footerText={copy.auth.signUp.footerText}
      footerLinkLabel={copy.auth.signUp.footerLinkLabel}
      footerLinkHref="/sign-in"
    />
  );
}
