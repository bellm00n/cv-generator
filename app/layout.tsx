import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Generator",
  description: "Local-first CV builder with editor and PDF preview.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="min-h-full">
      <body className="min-h-full bg-slate-100 font-sans leading-normal text-slate-800">
        {children}
      </body>
    </html>
  );
}
