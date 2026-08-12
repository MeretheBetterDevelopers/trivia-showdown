import "./globals.css";
import { ThemeProvider } from "./theme/ThemeProvider";
import { themeInitScript } from "./theme/themeInitScript";
import { QueryProvider } from "./query/QueryProvider";
import { Geist } from "next/font/google";
import { cn } from "@/src/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
