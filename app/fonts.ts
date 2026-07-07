import { Baloo_2, Nunito, JetBrains_Mono } from "next/font/google";

// Catpuccino identity — cozy & rounded. Baloo 2 is a plump, friendly display
// (very unlike fable-bull's Bricolage/Fraunces). Nunito for warm rounded body,
// JetBrains Mono only for the CA.
export const display = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});
export const sans = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});
