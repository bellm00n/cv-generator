"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

type CvPageMobileBarProps = {
  isPreviewActive: boolean;
  onDownloadPdf: () => void;
  onDownloadJson: () => void;
};

export function CvPageMobileBar({
  isPreviewActive,
  onDownloadPdf,
  onDownloadJson,
}: CvPageMobileBarProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3 lg:hidden"
      data-testid="mobile-bottom-bar"
    >
      {isPreviewActive && (
        <Dropdown
          variant="sheet"
          trigger={
            <Button
              color="secondary"
              variant="outlined"
              data-testid="mobile-theme-trigger"
            >
              Theme
              <ChevronDown className="ml-1 size-4" />
            </Button>
          }
          items={[{ label: "Coming soon", disabled: true }]}
        />
      )}

      <Dropdown
        variant="sheet"
        trigger={
          <Button
            color="primary"
            variant="outlined"
            data-testid="mobile-download-trigger"
          >
            Download
            <ChevronDown className="ml-1 size-4" />
          </Button>
        }
        items={[
          { label: "Download as PDF", onSelect: onDownloadPdf },
          { label: "Download as JSON", onSelect: onDownloadJson },
        ]}
      />
    </div>
  );
}
