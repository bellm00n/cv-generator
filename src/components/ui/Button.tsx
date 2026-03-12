import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-500 text-white border-blue-500 hover:brightness-95 disabled:hover:brightness-100",
  secondary: "bg-white text-slate-800 border-slate-300 hover:bg-slate-50",
  ghost:
    "bg-transparent text-slate-500 border-transparent hover:text-slate-800",
  destructive:
    "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 disabled:hover:bg-red-50",
};

export function Button({
  type = "button",
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
