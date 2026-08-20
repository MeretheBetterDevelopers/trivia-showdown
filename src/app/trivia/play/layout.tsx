import { BackToHomeButton } from "@/src/components/BackToHomeButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 pt-20 pb-10">
      <BackToHomeButton />
      {children}
    </div>
  );
}
