import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Manrope, DM_Mono } from "next/font/google";
import "./globals.css";

// Body — DM Sans: clean, modern, humanist
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

// Display / UI — Space Grotesk: modern, technical, editorial
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

// Scene headers — Manrope: editorial headlines (Scenes 03, 04, 05)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

// Mono — DM Mono: credits, labels, monospaced details (Scenes 01, 02)
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
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
        {children}
      </body>
    </html>
  );
}
