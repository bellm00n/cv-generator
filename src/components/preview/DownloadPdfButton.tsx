"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import type { CvDocument } from "@/types/cv";
import { CvPdfDocument } from "@/components/preview/pdf/CvPdfDocument";

type DownloadPdfButtonProps = {
  cvData: CvDocument;
  fileName: string;
  className?: string;
};

export function DownloadPdfButton({
  cvData,
  fileName,
  className,
}: DownloadPdfButtonProps) {
  return (
    <PDFDownloadLink
      document={<CvPdfDocument cvData={cvData} />}
      fileName={fileName}
      className={className}
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
}
