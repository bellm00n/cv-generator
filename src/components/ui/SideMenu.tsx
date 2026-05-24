"use client";

import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/cn";

type SideMenuProps = {
  open?: boolean;
  onClose?: () => void;
  variant: "overlay" | "static";
  children: ReactNode;
  className?: string;
};

export function SideMenu({
  open = false,
  onClose,
  variant,
  children,
  className,
}: SideMenuProps) {
  useEffect(() => {
    if (variant !== "overlay" || !open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [variant, open, onClose]);

  if (variant === "static") {
    return (
      <aside
        className={cn(
          "flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white",
          className,
        )}
      >
        {children}
      </aside>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        role="presentation"
        data-testid="side-menu-backdrop"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl",
          className,
        )}
      >
        {children}
      </aside>
    </div>
  );
}
