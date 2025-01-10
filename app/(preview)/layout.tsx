import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Inter } from 'next/font/google';
import NextLink from "next/link";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL("https://popuzar.ai"),
  title: "Quizz AI by Popuzar",
  description: "Transform any document into an interactive quiz with Quizz AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${inter.className}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
              <div className="flex">
                <NextLink href="/" className="flex items-center space-x-2 text-primary font-bold text-lg">
                  Popuzar AI
                </NextLink>
              </div>
              <NextLink
                target="_blank"
                href="https://popuzar.com"
                className="flex items-center space-x-2 text-sm bg-primary px-4 py-1.5 rounded-md text-white hover:bg-primary/90 transition-colors"
              >
                Visit Popuzar AI
              </NextLink>
            </div>
          </header>
          <main className="mt-14">
            <Toaster position="top-center" richColors />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
