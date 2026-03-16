import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  helperText?: string;
  helperTone?: "muted" | "warning";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { id, label, helperText, helperTone = "muted", className, ...props },
    ref,
  ) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-slate-800">
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "min-h-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500/90",
            "transition-shadow focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none",
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
  },
);
