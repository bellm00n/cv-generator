import { pdf } from "@react-pdf/renderer";
import { CvPdfDocument } from "@/components/preview/pdf/CvPdfDocument";
import { cvDocumentSchema } from "@/schemas/documentSchema";
import { parseImportedCv } from "@/schemas/cvImportSchema";
import type { CvDocument } from "@/types/cv";

export function getCvPdfFileName(fullName: string) {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "cv"}.pdf`;
}

export async function downloadCvPdf(cvData: CvDocument, fileName: string) {
  const blob = await pdf(<CvPdfDocument cvData={cvData} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadCvPdfById(id: string) {
  const res = await fetch(`/api/cv/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch CV");
  }

  const cv = (await res.json()) as { data: unknown };
  const values = parseImportedCv(cv.data);
  if (!values) {
    throw new Error("Invalid CV data");
  }

  const cvData = cvDocumentSchema.parse(values);
  await downloadCvPdf(cvData, getCvPdfFileName(cvData.fullName));
}
