import { signInAction } from "../_actions/signIn";
import { AuthForm } from "../_components/AuthForm";
import { copy } from "@/src/lib/constants/copy";

export default function SignInPage() {
  return (
    <AuthForm
      action={signInAction}
      title={copy.auth.signIn.heading}
      submitLabel={copy.auth.signIn.submitButton}
      pendingLabel={copy.auth.signIn.pendingButton}
      footerText={copy.auth.signIn.footerText}
      footerLinkLabel={copy.auth.signIn.footerLinkLabel}
      footerLinkHref="/sign-up"
    />
  );
}
