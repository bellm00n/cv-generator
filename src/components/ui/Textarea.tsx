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
        <label htmlFor={id} className="text-sm font-medium text-app-text">
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "placeholder:text-app-muted/90 min-h-[5rem] rounded-md border border-app-border bg-white px-3 py-2 text-sm text-app-text",
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
  },
);
