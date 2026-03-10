import type { PropsWithChildren } from "react";
import { Header } from "@/components/Header";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
