import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Manrope, DM_Mono } from "next/font/google";
import "./globals.css";
import ConceptBanner from "@/components/concept-banner/ConceptBanner";

// Body — DM Sans: clean, modern, humanist (variable font — no weight needed)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display / UI — Space Grotesk: modern, technical, editorial (variable font — no weight needed)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Scene headers — Manrope: editorial headlines (Scenes 03, 04, 05) (variable font — no weight needed)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Mono — DM Mono: credits, labels, monospaced details (Scenes 01, 02) (non-variable)
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Penda Agency — We Bring Moments to Life",
  description:
    "Penda Agency creates unforgettable live events, audiovisual experiences, broadcasts and visual stories. Established in Kampala, Uganda.",
  keywords: ["event production", "audiovisual", "live events", "broadcast", "Uganda", "Kampala", "Penda Agency"],
  openGraph: {
    title: "Penda Agency — We Bring Moments to Life",
    description: "From the first idea to the final applause. Events, audiovisual, and visual storytelling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${manrope.variable} ${dmMono.variable} antialiased`}
      >
        <ConceptBanner />
        {children}
      </body>
    </html>
  );
}
