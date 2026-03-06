"use client";

import { type ChangeEvent, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { Button } from "@/components/ui/Button";
import { EMPTY_CV_DOCUMENT } from "@/constants/document";
import { cn } from "@/lib/cn";
import { mapCvFormValuesToDocument } from "@/lib/mappers";
import { normalizePersistedCvForm } from "@/lib/normalizers";
import { CV_FORM_STORAGE_KEY, cvUploadSchema } from "@/lib/schemas";
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
  const [_isEditorDirty, setIsEditorDirty] = useState(false);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileName = getFileName(cvDocument.fullName);

  const handleUploadData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json: unknown = JSON.parse(e.target?.result as string);
        const result = cvUploadSchema.safeParse(json);

        if (!result.success) {
          alert("The uploaded file is not valid");
          return;
        }

        const normalized = normalizePersistedCvForm(result.data);
        if (!normalized) {
          alert("The uploaded file is not valid");
          return;
        }

        window.localStorage.setItem(
          CV_FORM_STORAGE_KEY,
          JSON.stringify(normalized),
        );
        setCvDocument(mapCvFormValuesToDocument(normalized));
        setEditorResetKey((current) => current + 1);
      } catch {
        alert("The uploaded file is not valid");
      }
    };
    reader.readAsText(file);
  };

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
    const confirmed = window.confirm(
      "DANGER! If you confirm this operation all CV data will be removed!",
    );
    if (!confirmed) return;

    window.localStorage.removeItem(CV_FORM_STORAGE_KEY);
    setCvDocument(EMPTY_CV_DOCUMENT);
    setIsEditorDirty(false);
    setEditorResetKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-app-bg py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-rhythm px-4 sm:px-6 lg:px-8">
        <section className="sticky top-0 z-10 rounded-lg bg-app-surface px-rhythm py-2 lg:hidden">
          {isMobilePreviewOpen ? (
            <Button
              variant="secondary"
              className="min-h-7 px-2.5 py-1 text-xs"
              onClick={() => setIsMobilePreviewOpen(false)}
            >
              Back to editor
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="min-h-7 px-2.5 py-1 text-xs"
              onClick={() => setIsMobilePreviewOpen(true)}
            >
              Open Preview
            </Button>
          )}
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleUploadData}>
                Upload data
              </Button>
              <Button variant="secondary" onClick={handleDownloadData}>
                Download data
              </Button>
              <Button variant="destructive" onClick={handleReset}>
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
