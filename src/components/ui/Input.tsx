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
          "text-sm font-medium text-slate-800",
          hideLabel ? "sr-only" : undefined,
        )}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-500/90",
          "transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
          className,
        )}
        {...props}
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
});
