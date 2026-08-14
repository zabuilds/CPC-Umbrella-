import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cayman Property Check",
  description: "Property oversight and owner-support platform for absentee property owners in Grand Cayman.",
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
