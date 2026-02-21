"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CvDocument } from "@/types/cv";
import { Button } from "@/components/ui/Button";

const PREVIEW_SURFACE_STYLE = {
  backgroundColor: "var(--color-surface)",
} as const;

const PdfPreviewFrame = dynamic(
  () =>
    import("@/components/preview/PdfPreviewFrame").then(
      (module) => module.PdfPreviewFrame,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full items-center justify-center text-sm text-app-muted"
        style={PREVIEW_SURFACE_STYLE}
      >
        Loading preview...
      </div>
    ),
  },
);

type PreviewPanelProps = {
  className?: string;
  cvData: CvDocument;
  headerAction?: ReactNode;
  showCloseAction?: boolean;
  onClose?: () => void;
};

export function PreviewPanel({
  className,
  cvData,
  headerAction,
  showCloseAction = false,
  onClose,
}: PreviewPanelProps) {
  return (
    <section
      className={cn("rounded-lg bg-app-surface p-rhythm", className)}
      aria-labelledby="preview-panel-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 id="preview-panel-title" className="text-xl">
            Preview Panel
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {showCloseAction ? (
            <Button variant="secondary" onClick={onClose}>
              Back to editor
            </Button>
          ) : null}
          {headerAction}
        </div>
      </div>

      <div className="mt-rhythm rounded-md" style={PREVIEW_SURFACE_STYLE}>
        <div
          className="mx-auto aspect-[595.28/841.89] w-full max-w-[35rem] overflow-hidden rounded-sm border border-app-border shadow-sm"
          style={PREVIEW_SURFACE_STYLE}
        >
          <PdfPreviewFrame cvData={cvData} />
        </div>
      </div>
    </section>
  );
}
