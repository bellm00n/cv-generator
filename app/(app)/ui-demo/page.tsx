"use client";

import { useState } from "react";
import { Code2, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { SideMenu } from "@/components/ui/SideMenu";

export default function UiDemoPage() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const sampleItems = [
    { label: "Option A", onSelect: () => setLastSelected("Option A") },
    { label: "Option B", onSelect: () => setLastSelected("Option B") },
    {
      label: "Disabled option",
      onSelect: () => setLastSelected("disabled was clicked"),
      disabled: true,
    },
  ];

  return (
    <main className="flex h-[calc(100vh-3.5rem)]">
      <SideMenu variant="static">
        <div className="p-4 text-sm font-semibold text-slate-800">
          Static SideMenu
        </div>
        <nav className="flex flex-col gap-1 px-2 text-sm text-slate-700">
          <div className="rounded px-2 py-1.5 hover:bg-slate-100">Item 1</div>
          <div className="rounded px-2 py-1.5 hover:bg-slate-100">Item 2</div>
          <div className="rounded px-2 py-1.5 hover:bg-slate-100">Item 3</div>
        </nav>
      </SideMenu>

      <section className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          UI primitives demo
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Throwaway route for verifying Dropdown and SideMenu primitives.
          Removed in cleanup task.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Dropdown
            trigger={
              <Button color="secondary" variant="outlined">
                Open popover
              </Button>
            }
            items={sampleItems}
          />

          <Dropdown
            variant="sheet"
            trigger={
              <Button color="secondary" variant="outlined">
                Open sheet
              </Button>
            }
            items={sampleItems}
          />

          <Button
            color="secondary"
            variant="outlined"
            onClick={() => setOverlayOpen(true)}
            aria-label="Open overlay menu"
          >
            <Menu className="size-4" />
            <span className="ml-2">Open overlay menu</span>
          </Button>
        </div>

        <p
          className="mt-6 text-sm text-slate-600"
          data-testid="last-selected"
          aria-live="polite"
        >
          Last selected: {lastSelected ?? "(none)"}
        </p>
      </section>

      <SideMenu
        variant="overlay"
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <span className="text-sm font-semibold text-slate-800">
            Overlay SideMenu
          </span>
          <button
            type="button"
            onClick={() => setOverlayOpen(false)}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>
        <div className="mt-auto flex items-center gap-2 border-t border-slate-200 p-4 text-sm text-slate-600">
          <Code2 className="size-4" aria-hidden />
          <span data-testid="lucide-icon-label">lucide icon</span>
        </div>
      </SideMenu>
    </main>
  );
}
