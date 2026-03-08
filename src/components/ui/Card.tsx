import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className="border-app-accent/30 rounded-md border-l-2 bg-gray-50/50 p-3">
      {children}
    </div>
  );
}
