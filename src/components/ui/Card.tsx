import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className="rounded-md border-l-2 border-gray-200 bg-gray-50/50 p-3">
      {children}
    </div>
  );
}
