"use client";

import {
  type ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

export type DropdownItem = {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  variant?: "popover" | "sheet";
  menuClassName?: string;
};

type TriggerProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu";
};

export function Dropdown({
  trigger,
  items,
  align = "left",
  variant = "popover",
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const handleClick = (event: MouseEvent) => {
      if (variant === "sheet") return;
      const target = event.target as Node | null;
      if (!target) return;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) close();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [open, variant, close]);

  const handleItemSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    close();
  };

  const triggerProps: TriggerProps = {
    onClick: (event) => {
      event.stopPropagation();
      setOpen((value) => !value);
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
  };

  const renderedTrigger = isValidElement(trigger) ? (
    cloneElement(trigger as React.ReactElement<TriggerProps>, triggerProps)
  ) : (
    <button type="button" {...triggerProps}>
      {trigger}
    </button>
  );

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {renderedTrigger}

      {open && variant === "popover" && (
        <div
          role="menu"
          className={cn(
            "absolute z-30 mt-1 min-w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {items.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => handleItemSelect(item)}
              className={cn(
                "block w-full px-3 py-2 text-left text-sm",
                item.disabled
                  ? "cursor-not-allowed text-slate-400"
                  : "text-slate-800 hover:bg-slate-100",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {open && variant === "sheet" && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 flex items-end bg-slate-900/40"
          onClick={close}
        >
          <div
            role="menu"
            className="w-full bg-white pb-[env(safe-area-inset-bottom)] shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col">
              {items.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => handleItemSelect(item)}
                  className={cn(
                    "border-b border-slate-100 px-4 py-4 text-left text-base",
                    item.disabled
                      ? "cursor-not-allowed text-slate-400"
                      : "text-slate-800 hover:bg-slate-50",
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={close}
                className="px-4 py-4 text-center text-base font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
