import "./globals.css";
import { ThemeProvider } from "./theme/theme-provider";
import { themeInitScript } from "./theme/theme-init-script";
import { QueryProvider } from "./query/query-provider";
import { Barlow, DM_Sans } from "next/font/google";
import { clsx } from "clsx";
import { Toaster } from "@/src/components/ui/sonner";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx("font-sans", barlow.variable, dmSans.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
