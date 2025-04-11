/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Lato, Quicksand } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato'
});

// Load Quicksand font with different weights (e.g., 300, 400, 700)
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-quicksand'
});

export const metadata: Metadata = {
  title: "Troco",
  description: "Your Top Secure Escrow Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-screen h-screen font-lato antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
