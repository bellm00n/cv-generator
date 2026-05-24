import { pdf } from "@react-pdf/renderer";
import { CvPdfDocument } from "@/components/preview/pdf/CvPdfDocument";
import type { CvDocument } from "@/types/cv";

export async function downloadCvPdf(cvData: CvDocument, fileName: string) {
  const blob = await pdf(<CvPdfDocument cvData={cvData} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
