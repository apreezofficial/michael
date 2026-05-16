import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevQuiz | Master the Web",
  description: "A premium, interactive quiz platform for modern developers to test their technical skills.",
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
