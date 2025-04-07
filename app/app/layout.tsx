import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { ThemeProvider } from "@/components/theme-provider";
import RecoilRootWrapper from "./RecoilWrapper";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "MusicRoom - Collaborative Music Sharing Platform",
  description:
    "Share music together, vote on what plays next. Create a room, invite friends, and build the perfect playlist together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
