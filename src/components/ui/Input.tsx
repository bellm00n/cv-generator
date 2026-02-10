import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  helperText?: string;
};

export function Input({ id, label, helperText, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-app-text">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-11 rounded-md border border-app-border bg-white px-3 text-sm text-app-text placeholder:text-app-muted/90",
          "transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/40",
          className
        )}
        {...props}
      />
      {helperText ? <p className="text-xs text-app-muted">{helperText}</p> : null}
    </div>
  );
}
