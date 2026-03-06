import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ id, label, className, ...props }, ref) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-app-text",
          props.disabled && "cursor-default opacity-50",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="focus-visible:ring-app-accent/40 h-4 w-4 rounded border-app-border text-app-accent accent-app-accent focus-visible:outline-none focus-visible:ring-2"
          {...props}
        />
        {label}
      </label>
    );
  },
);
