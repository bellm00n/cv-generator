import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-app-accent text-white border-app-accent hover:brightness-95 disabled:hover:brightness-100",
  secondary: "bg-app-surface text-app-text border-app-border hover:bg-slate-50",
  ghost: "bg-transparent text-app-muted border-transparent hover:text-app-text"
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
        "inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    />
  );
}
