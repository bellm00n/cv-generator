"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  MONTH_FULL_NAMES,
  MONTH_SHORT_NAMES,
  YEAR_MONTH_REGEX,
} from "@/constants/date";

type MonthPickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  helperTone?: "muted" | "warning";
};

function parseYearMonth(value: string): { year: number; month: number } | null {
  const match = value.match(YEAR_MONTH_REGEX);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) };
}

function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function MonthPicker({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  className,
  helperText,
  helperTone = "muted",
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseYearMonth(value);
  const [viewYear, setViewYear] = useState(
    parsed?.year ?? new Date().getFullYear(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onBlur?.();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onBlur]);

  useEffect(() => {
    const p = parseYearMonth(value);
    if (p) setViewYear(p.year);
  }, [value]);

  const handleSelect = useCallback(
    (monthIndex: number) => {
      onChange(formatYearMonth(viewYear, monthIndex + 1));
      setOpen(false);
      onBlur?.();
    },
    [viewYear, onChange, onBlur],
  );

  const displayText = parsed
    ? `${MONTH_FULL_NAMES[parsed.month - 1]} ${parsed.year}`
    : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
      </label>

      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex h-9 w-full items-center rounded-lg border border-slate-300 bg-white px-3 text-left text-sm",
            "transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
            displayText ? "text-slate-800" : "text-slate-500/90",
            disabled && "cursor-default opacity-50",
            className,
          )}
        >
          {displayText ?? "Select month"}
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-300 bg-white p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setViewYear((y) => y - 1)}
                aria-label="Previous year"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-sm font-medium tabular-nums">
                {viewYear}
              </span>
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setViewYear((y) => y + 1)}
                aria-label="Next year"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-1">
              {MONTH_SHORT_NAMES.map((monthLabel, index) => {
                const isSelected =
                  parsed?.year === viewYear && parsed?.month === index + 1;

                return (
                  <button
                    key={monthLabel}
                    type="button"
                    onClick={() => handleSelect(index)}
                    className={cn(
                      "rounded-lg py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-slate-100",
                    )}
                  >
                    {monthLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {helperText ? (
        <p
          className={cn(
            "text-xs",
            helperTone === "warning" ? "text-amber-700" : "text-slate-500",
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
