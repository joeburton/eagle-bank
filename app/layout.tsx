import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Eagle Bank",
    template: "%s | Eagle Bank",
  },
  description: "Secure and modern banking with Eagle Bank",
  metadataBase: new URL("https://eagle-bank-one.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
