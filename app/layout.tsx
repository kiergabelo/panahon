import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Panahon — PH Weather Dashboard",
  description: "Real-time Philippine weather dashboard powered by Open-Meteo. No API key required.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Panahon — PH Weather Dashboard",
    description: "Real-time Philippine weather dashboard powered by Open-Meteo.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
