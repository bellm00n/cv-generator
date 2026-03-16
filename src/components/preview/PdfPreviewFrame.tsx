"use client";

import { useEffect, useRef, useState } from "react";
import { usePDF } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { CvDocument } from "@/types/cv";
import { CvPdfDocument } from "@/components/preview/pdf/CvPdfDocument";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfPreviewFrameProps = {
  cvData: CvDocument;
};

export function PdfPreviewFrame({ cvData }: PdfPreviewFrameProps) {
  const [instance, updateInstance] = usePDF();

  useEffect(() => {
    updateInstance(<CvPdfDocument cvData={cvData} />);
  }, [cvData, updateInstance]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm"
      >
        {instance.loading && (
          <div className="flex aspect-210/297 items-center justify-center text-sm text-slate-500">
            Loading preview...
          </div>
        )}
        {instance.error && (
          <div className="flex aspect-210/297 items-center justify-center text-sm text-slate-500">
            Failed to load preview
          </div>
        )}
        {!instance.loading &&
          !instance.error &&
          instance.url &&
          containerWidth > 0 && (
            <Document
              file={instance.url}
              onLoadSuccess={({ numPages: n }) => {
                setNumPages(n);
                setCurrentPage(1);
              }}
            >
              <Page pageNumber={currentPage} width={containerWidth} />
            </Document>
          )}
      </div>

      {numPages > 1 && (
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            ←
          </button>
          <span>
            {currentPage} / {numPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= numPages}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
