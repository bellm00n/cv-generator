"use client";

import { type KeyboardEvent, useState } from "react";
import { cn } from "@/lib/cn";
import { Chip } from "./Chip";

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
            <Chip
              key={`${value}-${index}`}
              value={value}
              onRemove={() => onRemove(index)}
            />
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
