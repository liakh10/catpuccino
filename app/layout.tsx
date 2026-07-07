import type { Metadata } from "next";
import "./globals.css";
import { SolanaProviders } from "./providers";
import { TICKER, TOKEN_NAME } from "./config";
import { display, sans, mono } from "./fonts";

export const metadata: Metadata = {
  title: TICKER, // tab title is always just the ticker
  description: `${TOKEN_NAME} — a cozy cat café on Solana. Brew catpuccinos for sleepy cats, keep them purring, and collect the whole clowder.`,
};

export const viewport = { themeColor: "#f4e9d8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <SolanaProviders>{children}</SolanaProviders>
      </body>
    </html>
  );
}
