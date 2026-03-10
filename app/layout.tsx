import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ActaProvider } from "@/src/components/providers/ActaProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GIVE-Interactuar Platform",
  description: "Stellar-first verifiable credentials platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <ActaProvider>
          {children}
        </ActaProvider>
      </body>
    </html>
  );
}
