import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Panahon — PH Weather Dashboard",
  description: "Real-time Philippine weather with hand-rolled SVG charts. 8 cities, Open-Meteo data, no API key required.",
  manifest: "/manifest.webmanifest",
  applicationName: "Panahon",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Panahon" },
  openGraph: {
    title: "Panahon — PH Weather Dashboard",
    description: "Real-time Philippine weather with hand-rolled SVG charts. Powered by Open-Meteo.",
    type: "website",
    siteName: "Panahon",
  },
  twitter: {
    card: "summary",
    title: "Panahon — PH Weather Dashboard",
    description: "Real-time Philippine weather with hand-rolled SVG charts.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
