import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ClarityOS — AI Work Tracker",
  description: "ClarityOS silently tracks what you work on, classifies it with local AI, and gives you a live productivity dashboard. Know exactly where your day went.",
  keywords: ["productivity", "AI work tracker", "time tracking", "focus", "deep work"],
  authors: [{ name: "ClarityOS" }],
  openGraph: {
    title: "ClarityOS — AI Work Tracker",
    description: "Know exactly where your day went. AI-powered work tracking, live dashboard, auto-checklist.",
    type: "website",
    url: "https://clarityos.kvantumtech.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-[#080810] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
