import { AppHeader } from "@/src/components/AppHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
      <AppHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        {children}
      </div>
    </div>
  );
}
