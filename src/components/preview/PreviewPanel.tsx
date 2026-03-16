import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CvDocument } from "@/types/cv";

const PdfPreviewFrame = dynamic(
  () =>
    import("@/components/preview/PdfPreviewFrame").then(
      (module) => module.PdfPreviewFrame,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-white text-sm text-slate-500">
        Loading preview...
      </div>
    ),
  },
);

type PreviewPanelProps = {
  className?: string;
  cvData: CvDocument;
  headerAction?: ReactNode;
};

export function PreviewPanel({
  className,
  cvData,
  headerAction,
}: PreviewPanelProps) {
  return (
    <section
      className={cn("rounded-xl bg-white p-6", className)}
      aria-labelledby="preview-panel-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2
            id="preview-panel-title"
            className="text-xl leading-tight font-semibold"
          >
            Preview Panel
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerAction}
        </div>
      </div>

      <div className="mt-6">
        <div className="mx-auto aspect-[210/297] w-full max-w-[35rem] overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
          <PdfPreviewFrame cvData={cvData} />
        </div>
      </div>
    </section>
  );
}
