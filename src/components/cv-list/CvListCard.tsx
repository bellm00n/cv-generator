"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Copy, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

type CvListCardProps = {
  cv: { id: string; title: string; createdAt: string };
  onDownloadPdf: () => void;
  onCopy: () => void;
  onRemove: () => void;
  isBusy?: boolean;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

type IconActionProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  icon: ReactNode;
};

function IconAction({
  label,
  onClick,
  disabled,
  variant = "default",
  icon,
}: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm text-slate-600 transition-colors",
        "hover:bg-slate-100 hover:text-slate-800",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600",
        variant === "destructive" && "hover:bg-red-50 hover:text-red-600",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function CvListCard({
  cv,
  onDownloadPdf,
  onCopy,
  onRemove,
  isBusy = false,
}: CvListCardProps) {
  return (
    <article
      className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300"
      data-testid={`cv-card-${cv.id}`}
    >
      <Link
        href={`/cv/${cv.id}`}
        className="line-clamp-2 text-base font-semibold text-slate-800 hover:text-blue-500"
      >
        {cv.title}
      </Link>
      <p className="text-sm text-slate-500">
        Created at: {formatDate(cv.createdAt)}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
        <IconAction
          label="Download PDF"
          onClick={onDownloadPdf}
          disabled={isBusy}
          icon={<Download className="size-4" />}
        />
        <IconAction
          label="Copy"
          onClick={onCopy}
          disabled={isBusy}
          icon={<Copy className="size-4" />}
        />
        <IconAction
          label="Remove"
          onClick={onRemove}
          disabled={isBusy}
          variant="destructive"
          icon={<Trash2 className="size-4" />}
        />
      </div>
    </article>
  );
}
