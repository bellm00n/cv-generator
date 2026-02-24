"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { Button } from "@/components/ui/Button";
import { EMPTY_CV_DOCUMENT } from "@/constants";
import { cn } from "@/lib/cn";
import { CV_FORM_STORAGE_KEY } from "@/lib/cvForm";
import type { CvDocument } from "@/types/cv";

const DOWNLOAD_BUTTON_CLASS =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-app-accent bg-app-accent px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:brightness-95 focus-visible:translate-y-0";

const DownloadPdfButton = dynamic(
  () =>
    import("@/components/preview/DownloadPdfButton").then(
      (module) => module.DownloadPdfButton,
    ),
  {
    ssr: false,
    loading: () => (
      <span className={DOWNLOAD_BUTTON_CLASS} aria-live="polite">
        Preparing PDF...
      </span>
    ),
  },
);

const getFileName = (fullName: string) => {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "cv"}.pdf`;
};

export default function HomePage() {
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [cvDocument, setCvDocument] = useState<CvDocument>(EMPTY_CV_DOCUMENT);
  const [isEditorDirty, setIsEditorDirty] = useState(false);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const fileName = getFileName(cvDocument.fullName);

  const handleDownloadData = () => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(CV_FORM_STORAGE_KEY);
    if (!raw) return;

    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", "_")
      .replaceAll(":", "-");

    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-backup_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CV_FORM_STORAGE_KEY);
    }

    setCvDocument(EMPTY_CV_DOCUMENT);
    setIsEditorDirty(false);
    setEditorResetKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-app-bg py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-rhythm px-4 sm:px-6 lg:px-8">
        <section className="rounded-lg bg-app-surface p-rhythm lg:hidden">
          <Button
            variant="secondary"
            onClick={() => setIsMobilePreviewOpen(true)}
            disabled={isMobilePreviewOpen}
          >
            Open Preview
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-rhythm lg:grid-cols-2">
          <div
            className={cn(
              "flex flex-col gap-3",
              isMobilePreviewOpen && "hidden lg:flex",
            )}
          >
            <EditorPanel
              key={editorResetKey}
              onCvDataChange={setCvDocument}
              onDirtyChange={setIsEditorDirty}
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleDownloadData}>
                Download data
              </Button>
              <Button
                variant="destructive"
                onClick={handleReset}
                disabled={!isEditorDirty}
              >
                Reset
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "flex flex-col gap-rhythm",
              !isMobilePreviewOpen && "hidden lg:flex",
            )}
          >
            <PreviewPanel
              cvData={cvDocument}
              showCloseAction={isMobilePreviewOpen}
              onClose={() => setIsMobilePreviewOpen(false)}
              headerAction={
                <DownloadPdfButton
                  cvData={cvDocument}
                  fileName={fileName}
                  className={DOWNLOAD_BUTTON_CLASS}
                />
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}
