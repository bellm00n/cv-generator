"use client";

import { ChevronDown, Grid3x3 } from "lucide-react";
import { EditableCvTitle } from "@/components/editor/EditableCvTitle";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

type CvPageHeaderProps = {
  title: string;
  onTitleSave: (newTitle: string) => Promise<void>;
  onOpenMenu: () => void;
  onDownloadPdf: () => void;
  onDownloadJson: () => void;
  isMobilePreviewOpen: boolean;
  onToggleMobilePreview: () => void;
};

export function CvPageHeader({
  title,
  onTitleSave,
  onOpenMenu,
  onDownloadPdf,
  onDownloadJson,
  isMobilePreviewOpen,
  onToggleMobilePreview,
}: CvPageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          data-testid="open-menu"
          className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
        >
          <Grid3x3 className="size-5" />
        </button>
        <EditableCvTitle title={title} onSave={onTitleSave} />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden lg:block">
          <Dropdown
            align="right"
            trigger={
              <Button
                color="secondary"
                variant="outlined"
                data-testid="theme-trigger"
              >
                Theme
                <ChevronDown className="ml-1 size-4" />
              </Button>
            }
            items={[{ label: "Coming soon", disabled: true }]}
          />
        </div>

        <div className="hidden lg:block">
          <Dropdown
            align="right"
            trigger={
              <Button
                color="secondary"
                variant="outlined"
                data-testid="download-trigger"
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

        <Button
          color="secondary"
          variant="outlined"
          className="lg:hidden"
          onClick={onToggleMobilePreview}
          data-testid="preview-toggle"
        >
          {isMobilePreviewOpen ? "Edit" : "Preview"}
        </Button>
      </div>
    </header>
  );
}
