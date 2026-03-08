"use client";

import { type KeyboardEvent, useState } from "react";
import { cn } from "@/lib/cn";

type ChipsProps = {
  id: string;
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  helperText?: string;
  helperTone?: "muted" | "warning";
};

export function Chips({
  id,
  label,
  hideLabel = false,
  placeholder,
  values,
  onAdd,
  onRemove,
  helperText,
  helperTone = "muted",
}: ChipsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    onAdd(trimmed);
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-app-text",
          hideLabel ? "sr-only" : undefined,
        )}
      >
        {label}
      </label>

      {values.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="bg-app-accent/10 inline-flex items-center gap-1 rounded-md border border-app-border px-2 py-0.5 text-sm text-app-text"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                className="hover:bg-app-accent/20 ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-app-muted transition-colors hover:text-app-text"
                onClick={() => onRemove(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-3"
                >
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : "Add another…"}
        className="placeholder:text-app-muted/90 focus-visible:ring-app-accent/40 h-9 w-full rounded-md border border-app-border bg-white px-3 text-sm text-app-text outline-none transition-shadow focus-visible:ring-2"
      />

      {helperText ? (
        <p
          className={cn(
            "text-xs",
            helperTone === "warning" ? "text-amber-700" : "text-app-muted",
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
