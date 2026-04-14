import { IBM_Plex_Mono, IBM_Plex_Sans, Press_Start_2P } from "next/font/google";
import SiteShell from "./site-shell";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400"
});

export const metadata = {
  title: "Matt Ramirez",
  description:
    "Welcome to the discourse cafe can I get you started with a sunny angel limited edition dubai choclate matcha cortado?"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${pressStart.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
