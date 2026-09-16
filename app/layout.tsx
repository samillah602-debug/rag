import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPT-5.6 Chat",
  description: "A Next.js chatbot powered by OpenAI GPT-5.6 models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
