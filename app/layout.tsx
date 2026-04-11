
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import SiteShell from "./site-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

export const metadata = {
  title: "Matt Ramirez",
  description:
    "Minimalist Frutiger Aero inspired portfolio for Matt Ramirez across platforms, policy, AI governance, and institutional systems."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
