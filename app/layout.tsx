import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xai — Intelligence Workspace",
  description:
    "From raw data to structured intelligence to action. Xai turns every source into decisions your team can run.",
  metadataBase: new URL("https://xai-intelligence.example.com"),
  openGraph: {
    title: "Xai — Intelligence Workspace",
    description: "From raw data to structured intelligence to action.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="relative min-h-screen antialiased">
        {/* Fixed atmospheric wash behind all content. */}
        <div
          aria-hidden
          className="bg-atmosphere pointer-events-none fixed inset-0 -z-10"
        />
        {children}
      </body>
    </html>
  );
}
