"use client";

import { useEffect, useRef, useState } from "react";
import { usePDF } from "@react-pdf/renderer";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    updateInstance(<CvPdfDocument cvData={cvData} />);
  }, [cvData, updateInstance]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0].contentRect.width;
      if (nextWidth > 0) {
        setContainerWidth(nextWidth);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayTotal = Math.max(numPages, 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < numPages;

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4 pt-4 pb-20">
        <div
          ref={containerRef}
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm"
        >
          {instance.error && (
            <div className="flex aspect-210/297 items-center justify-center text-sm text-slate-500">
              Failed to load preview
            </div>
          )}
          {!instance.error && instance.url && containerWidth > 0 && (
            <Document
              file={instance.url}
              loading=""
              noData=""
              onLoadSuccess={({ numPages: n }) => {
                setNumPages(n);
                setCurrentPage((p) => Math.min(p, n) || 1);
              }}
            >
              <Page
                pageNumber={currentPage}
                width={containerWidth}
                loading=""
              />
            </Document>
          )}
          {!instance.error && !instance.url && (
            <div className="aspect-210/297" />
          )}
        </div>
      </div>

      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-md"
        data-testid="preview-pagination"
      >
        <button
          type="button"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={!canPrev}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span data-testid="preview-page-chip">
          {currentPage} / {displayTotal}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={!canNext}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
