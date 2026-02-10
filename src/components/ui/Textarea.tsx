import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  helperText?: string;
  helperTone?: "muted" | "warning";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, helperText, helperTone = "muted", className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-app-text">
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "min-h-[6.5rem] rounded-md border border-app-border bg-white px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted/90",
          "transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/40",
          className
        )}
        {...props}
      />
      {helperText ? (
        <p
          className={cn(
            "text-xs",
            helperTone === "warning" ? "text-amber-700" : "text-app-muted"
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
