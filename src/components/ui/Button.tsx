import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonColor = "primary" | "secondary" | "ghost" | "destructive";
type ButtonVariant = "outlined" | "text";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  variant?: ButtonVariant;
};

const COLOR_STYLES: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    outlined:
      "bg-blue-500 text-white border-blue-500 hover:brightness-95 disabled:hover:brightness-100",
    text: "text-blue-500 hover:bg-blue-50",
  },
  secondary: {
    outlined: "bg-white text-slate-800 border-slate-300 hover:bg-slate-50",
    text: "text-slate-800 hover:bg-slate-100",
  },
  ghost: {
    outlined:
      "bg-transparent text-slate-500 border-transparent hover:text-slate-800",
    text: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800",
  },
  destructive: {
    outlined:
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 disabled:hover:bg-red-50",
    text: "text-red-700 hover:bg-red-50",
  },
};

export function Button({
  type = "button",
  color = "primary",
  variant = "text",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "outlined" && "border",
        COLOR_STYLES[color][variant],
        className,
      )}
      {...props}
    />
  );
}
