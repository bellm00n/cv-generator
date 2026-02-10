import { EditorPanel } from "@/components/EditorPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-app-bg py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-rhythm px-4 sm:px-6 lg:px-8">
        <header className="space-y-2 rounded-lg border border-app-border bg-app-surface p-rhythm">
          <h1 className="text-2xl sm:text-3xl">CV Generator MVP</h1>
        </header>

        <section className="grid grid-cols-1 gap-rhythm lg:grid-cols-2">
          <EditorPanel />
          <div className="flex flex-col gap-rhythm">
            <section className="flex flex-wrap items-center gap-3 rounded-lg border border-app-border bg-app-surface p-rhythm">
              <Button disabled>Download PDF</Button>
              <Button variant="secondary" disabled className="lg:hidden">
                Open Preview
              </Button>
              <Button variant="ghost" disabled>
                Reset
              </Button>
              <p className="text-xs text-app-muted">
                Action controls are intentionally disabled placeholders in Task
                1.
              </p>
            </section>

            <PreviewPanel className="hidden lg:block" />

            <section className="rounded-lg border border-dashed border-app-border bg-app-surface p-rhythm lg:hidden">
              <h2 className="text-base">Mobile / Tablet Mode</h2>
              <p className="mt-2 text-sm text-app-muted">
                Preview is hidden by default on small screens and will be opened
                via dedicated flow in Task 3.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
