import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";

type EditorPanelProps = {
  className?: string;
};

export function EditorPanel({ className }: EditorPanelProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-app-border bg-app-surface p-rhythm",
        className
      )}
      aria-labelledby="editor-panel-title"
    >
      <div className="space-y-2">
        <h2 id="editor-panel-title" className="text-xl">
          Editor Panel
        </h2>
        <p className="text-sm text-app-muted">
          Placeholder layout for the CV form. Functional inputs will be added in
          Task 2.
        </p>
      </div>

      <div className="mt-rhythm grid gap-rhythm sm:grid-cols-2">
        <Input
          id="placeholder-name"
          label="Name and surname"
          placeholder="Alex Johnson"
          disabled
          helperText="Placeholder input"
        />
        <Input
          id="placeholder-title"
          label="Title"
          placeholder="Product Manager"
          disabled
          helperText="Placeholder input"
        />
      </div>

      <div className="mt-rhythm rounded-md border border-dashed border-app-border p-4">
        <h3 className="text-base">Planned sections</h3>
        <p className="mt-2 text-sm text-app-muted">
          Contact details, summary, skills, languages, experience, and education
          blocks will be implemented as an accessible form.
        </p>
      </div>
    </section>
  );
}
