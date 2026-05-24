import dynamic from "next/dynamic";
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
};

export function PreviewPanel({ className, cvData }: PreviewPanelProps) {
  return (
    <section
      className={cn("relative overflow-hidden rounded-xl bg-white", className)}
    >
      <PdfPreviewFrame cvData={cvData} />
    </section>
  );
}
