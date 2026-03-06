import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  helperTone?: "muted" | "warning";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hideLabel = false,
    helperText,
    helperTone = "muted",
    className,
    ...props
  },
  ref,
) {
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
      <input
        ref={ref}
        id={id}
        className={cn(
          "placeholder:text-app-muted/90 h-9 rounded-md border border-app-border bg-white px-3 text-sm text-app-text",
          "focus-visible:ring-app-accent/40 transition-shadow focus-visible:outline-none focus-visible:ring-2",
          className,
        )}
        {...props}
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
});
