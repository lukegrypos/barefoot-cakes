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
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
