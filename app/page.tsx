"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EditorPanel } from "@/components/EditorPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Button } from "@/components/ui/Button";
import { EMPTY_CV_DOCUMENT } from "@/constants";
import { cn } from "@/lib/cn";
import { CV_FORM_STORAGE_KEY } from "@/lib/cvForm";
import type { CvDocument } from "@/types/cv";

const DOWNLOAD_BUTTON_CLASS =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-app-accent bg-app-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:brightness-95";

const DownloadPdfButton = dynamic(
  () =>
    import("@/components/pdf/DownloadPdfButton").then(
      (module) => module.DownloadPdfButton
    ),
  {
    ssr: false,
    loading: () => (
      <span className={DOWNLOAD_BUTTON_CLASS} aria-live="polite">
        Preparing PDF...
      </span>
    )
  }
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
        <header className="flex flex-wrap items-center justify-between gap-3 bg-app-surface px-4 py-2 rounded-lg">
          <h1 className="text-xl sm:text-2xl">CV Generator MVP</h1>
          <DownloadPdfButton
            cvData={cvDocument}
            fileName={fileName}
            className={DOWNLOAD_BUTTON_CLASS}
          />
        </header>

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
          <div className={cn("flex flex-col gap-3", isMobilePreviewOpen && "hidden lg:flex")}>
            <EditorPanel
              key={editorResetKey}
              onCvDataChange={setCvDocument}
              onDirtyChange={setIsEditorDirty}
            />
            <Button variant="destructive" onClick={handleReset} disabled={!isEditorDirty}>
              Reset
            </Button>
          </div>

          <div
            className={cn(
              "flex flex-col gap-rhythm",
              !isMobilePreviewOpen && "hidden lg:flex"
            )}
          >
            <PreviewPanel
              cvData={cvDocument}
              showCloseAction={isMobilePreviewOpen}
              onClose={() => setIsMobilePreviewOpen(false)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
