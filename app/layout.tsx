import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const ui = Source_Sans_3({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rollaway — Giveaway Twitch",
  description:
    "Tirage au sort Twitch : connecte le chat, ouvre les inscriptions, tire un ou plusieurs gagnants. Gratuit, sans compte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${ui.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
