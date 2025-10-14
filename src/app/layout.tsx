import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./navbar";

/*
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/

export const metadata: Metadata = {
  title: "GameLaunchPad",
  description: "A Web App for Integrated Game Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar/>
        {children}
      </body>
    </html>
  );
}