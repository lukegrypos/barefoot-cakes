import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Cake Inquiry | Barefoot Cakes & Makes",
  description:
    "Tell us a little about the cake you have in mind — we'd love to make something special for you.",
  openGraph: {
    title: "Barefoot Cakes & Makes — Custom Cake Inquiry",
    description: "Tell us a little about the cake you have in mind.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
