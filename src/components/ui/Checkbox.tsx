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
          "inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800 select-none",
          props.disabled && "cursor-default opacity-50",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="size-4 rounded border-slate-300 accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none"
          {...props}
        />
        {label}
      </label>
    );
  },
);
