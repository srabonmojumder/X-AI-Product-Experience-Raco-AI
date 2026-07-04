import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xai — Living Intelligence",
  description:
    "A living workspace that grows raw signal into intelligence your team can act on — gently, continuously, in real time.",
  metadataBase: new URL("https://xai-living.example.com"),
  openGraph: {
    title: "Xai — Living Intelligence",
    description: "Raw signal, grown into intelligence your team can act on.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EFE8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*
          Fonts are loaded via Google Fonts <link> inside the document head.
          This keeps the build network-free and portable; swap to next/font if
          you prefer self-hosting.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- applied globally from the App Router root layout */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen antialiased">
        {/* Fixed warm aurora wash behind all content. */}
        <div aria-hidden className="bg-aurora pointer-events-none fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
