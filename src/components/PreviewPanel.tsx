import { cn } from "@/lib/cn";

type PreviewPanelProps = {
  className?: string;
};

export function PreviewPanel({ className }: PreviewPanelProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-app-border bg-app-surface p-rhythm",
        className
      )}
      aria-labelledby="preview-panel-title"
    >
      <div className="space-y-2">
        <h2 id="preview-panel-title" className="text-xl">
          Preview Panel
        </h2>
        <p className="text-sm text-app-muted">
          Placeholder area for the live PDF preview that will be implemented in
          Task 3.
        </p>
      </div>

      <div className="mt-rhythm flex min-h-[24rem] flex-1 items-center justify-center rounded-md border border-dashed border-app-border bg-slate-50 p-4">
        <div className="aspect-[1/1.414] w-full max-w-[22rem] rounded-sm border border-app-border bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <div className="h-5 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
