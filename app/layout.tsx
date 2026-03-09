import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Generator",
  description: "Local-first CV builder with editor and PDF preview.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
