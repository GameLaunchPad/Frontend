import type { Metadata } from "next";
import "./globals.css";
import AppWrapper from "./AppWrapper";

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
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}