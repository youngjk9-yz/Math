import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "KumonFlow Math | Infinite Grade-Level Mastery & Efficient Solutions",
  description:
    "Kumon-style infinite math practice organized by grade level and micro-skill, featuring step-by-step most efficient solution keys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

