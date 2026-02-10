"use client";

import { PDFViewer } from "@react-pdf/renderer";
import type { CvDocument } from "@/types/cv";
import { CvPdfDocument } from "@/components/CvPdfDocument";

type PdfPreviewFrameProps = {
  cvData: CvDocument;
};

export function PdfPreviewFrame({ cvData }: PdfPreviewFrameProps) {
  return (
    <PDFViewer
      className="pdf-preview-frame"
      style={{
        border: "none",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--color-surface)"
      }}
      showToolbar={false}
    >
      <CvPdfDocument cvData={cvData} />
    </PDFViewer>
  );
}
