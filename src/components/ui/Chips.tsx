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
          "text-sm font-medium text-slate-800",
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
        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition-shadow placeholder:text-slate-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40"
      />

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
