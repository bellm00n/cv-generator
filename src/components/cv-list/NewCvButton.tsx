"use client";

import { type ChangeEvent, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

type NewCvButtonProps = {
  onCreate: () => void;
  onUpload: (file: File) => void;
  className?: string;
};

export function NewCvButton({
  onCreate,
  onUpload,
  className,
}: NewCvButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    event.target.value = "";
  };

  return (
    <div className={className}>
      <div className="inline-flex items-stretch">
        <Button
          color="primary"
          variant="outlined"
          onClick={onCreate}
          className="rounded-r-none"
          data-testid="new-cv-create"
        >
          New +
        </Button>
        <Dropdown
          align="right"
          trigger={
            <Button
              color="primary"
              variant="outlined"
              aria-label="More create options"
              className="rounded-l-none border-l-blue-400 px-2"
              data-testid="new-cv-chevron"
            >
              <ChevronDown className="size-4" />
            </Button>
          }
          items={[
            { label: "Create", onSelect: onCreate },
            { label: "Upload JSON", onSelect: triggerFilePicker },
          ]}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
        data-testid="upload-json-input"
      />
    </div>
  );
}
