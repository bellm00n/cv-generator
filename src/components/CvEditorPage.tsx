"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { AppSideMenu } from "@/components/AppSideMenu";
import { CvPageHeader } from "@/components/cv/CvPageHeader";
import { CvPageMobileBar } from "@/components/cv/CvPageMobileBar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import {
  downloadCvPdf,
  getCvPdfFileName,
} from "@/components/preview/downloadCvPdf";
import { EMPTY_CV_DOCUMENT } from "@/constants/document";
import { cn } from "@/lib/cn";
import { type CvFormValues } from "@/schemas/formSchema";
import type { CvDocument } from "@/types/cv";

type CvEditorPageProps = {
  cvId: string;
  cvTitle: string;
  initialFormValues: CvFormValues;
  user: Session["user"] | null;
};

export function CvEditorPage({
  cvId,
  cvTitle,
  initialFormValues,
  user,
}: CvEditorPageProps) {
  const router = useRouter();
  const [cvDocument, setCvDocument] = useState<CvDocument>(EMPTY_CV_DOCUMENT);
  const [currentFormValues, setCurrentFormValues] =
    useState<CvFormValues>(initialFormValues);
  const [title, setTitle] = useState(cvTitle);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

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

  const handleTitleSave = async (newTitle: string) => {
    const trimmed = newTitle.trim() || "Untitled CV";
    setTitle(trimmed);
    const res = await fetch(`/api/cv/${cvId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  const handleSave = async (values: CvFormValues) => {
    setCurrentFormValues(values);
    await saveToApi(values);
  };

  const handleDownloadPdf = () => {
    void downloadCvPdf(cvDocument, getCvPdfFileName(cvDocument.fullName));
  };

  const handleDownloadJson = () => {
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
    <div className="flex h-screen flex-col overflow-hidden">
      <CvPageHeader
        title={title}
        onTitleSave={handleTitleSave}
        onOpenMenu={() => setMenuOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        onDownloadJson={handleDownloadJson}
        isMobilePreviewOpen={isMobilePreviewOpen}
        onToggleMobilePreview={() => setIsMobilePreviewOpen((v) => !v)}
      />

      <div className="flex min-h-0 flex-1 lg:gap-4 lg:p-4">
        <EditorPanel
          className={cn(
            "min-w-0 flex-1 overflow-y-auto",
            isMobilePreviewOpen && "hidden lg:block",
          )}
          initialFormValues={currentFormValues}
          onCvDataChange={setCvDocument}
          onSave={handleSave}
        />

        <PreviewPanel
          className={cn(
            "min-w-0 flex-1",
            !isMobilePreviewOpen && "hidden lg:block",
          )}
          cvData={cvDocument}
        />
      </div>

      <CvPageMobileBar
        isPreviewActive={isMobilePreviewOpen}
        onDownloadPdf={handleDownloadPdf}
        onDownloadJson={handleDownloadJson}
      />

      <AppSideMenu
        variant="overlay"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
      />
    </div>
  );
}
