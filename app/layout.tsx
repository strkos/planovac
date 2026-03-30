import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "planovac",
  description: "Minimalni aplikacni kostra pro projekt planovac.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
