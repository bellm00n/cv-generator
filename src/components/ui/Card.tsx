import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className="rounded-lg border-l-2 border-slate-200 bg-slate-50/50 p-3">
      {children}
    </div>
  );
}
