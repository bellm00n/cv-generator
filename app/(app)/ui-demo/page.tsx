"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AppSideMenu } from "@/components/AppSideMenu";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

const MOCK_USER = {
  name: "Demo User",
  email: "demo@example.com",
  image: null,
};

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
      <AppSideMenu variant="static" user={MOCK_USER} />

      <section className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          UI primitives demo
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Throwaway route for verifying Dropdown, SideMenu and AppSideMenu
          primitives. Removed in cleanup task.
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

      <AppSideMenu
        variant="overlay"
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        user={MOCK_USER}
      />
    </main>
  );
}
