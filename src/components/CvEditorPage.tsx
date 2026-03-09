"use client";

import { type ChangeEvent, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { Button } from "@/components/ui/Button";
import { EMPTY_CV_DOCUMENT } from "@/constants/document";
import { cn } from "@/lib/cn";
import { parseImportedCv } from "@/schemas/cvImportSchema";
import {
  createDefaultCvFormValues,
  type CvFormValues,
} from "@/schemas/formSchema";
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

type CvEditorPageProps = {
  cvId: string;
  initialFormValues: CvFormValues;
};

export function CvEditorPage({ cvId, initialFormValues }: CvEditorPageProps) {
  const router = useRouter();
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [cvDocument, setCvDocument] = useState<CvDocument>(EMPTY_CV_DOCUMENT);
  const [currentFormValues, setCurrentFormValues] =
    useState<CvFormValues>(initialFormValues);
  const [editorKey, setEditorKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileName = getFileName(cvDocument.fullName);

  const saveToApi = async (values: CvFormValues) => {
    const res = await fetch(`/api/cv/${cvId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: values }),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  const handleSave = async (values: CvFormValues) => {
    setCurrentFormValues(values);
    await saveToApi(values);
  };

  const handleUploadData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json: unknown = JSON.parse(e.target?.result as string);
        const normalized = parseImportedCv(json);

        if (!normalized) {
          alert("The uploaded file is not valid");
          return;
        }

        await saveToApi(normalized);
        setCurrentFormValues(normalized);
        setEditorKey((k) => k + 1);
      } catch {
        alert("The uploaded file is not valid");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "DANGER! If you confirm this operation all CV data will be removed!",
    );
    if (!confirmed) return;

    const empty = createDefaultCvFormValues();
    await saveToApi(empty);
    setCurrentFormValues(empty);
    setEditorKey((k) => k + 1);
  };

  const handleDownloadData = () => {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", "_")
      .replaceAll(":", "-");

    const blob = new Blob([JSON.stringify(currentFormValues, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-backup_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-app-bg py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-rhythm px-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/cv-list">
            <Button variant="ghost">← Back to List</Button>
          </Link>
        </div>

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
              key={editorKey}
              initialFormValues={currentFormValues}
              onCvDataChange={setCvDocument}
              onSave={handleSave}
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
