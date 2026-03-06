import type { ReactNode } from "react";

type ItemCardProps = {
  children: ReactNode;
};

export function ItemCard({ children }: ItemCardProps) {
  return (
    <div className="border-app-accent/30 rounded-md border-l-2 bg-gray-50/50 p-3">
      {children}
    </div>
  );
}
