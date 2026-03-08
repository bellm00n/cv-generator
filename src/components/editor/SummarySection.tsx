import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/cn";
import { Textarea } from "@/components/ui/Textarea";
import type { CvFormValues } from "@/schemas/formSchema";
import { WARNING_INPUT_CLASS, getWarningMessage } from "./editorUtils";

export function SummarySection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const summaryValue = watch("summary") ?? "";

  return (
    <section className="py-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Summary</h3>
        <p className="text-xs text-app-muted">
          Briefly describe your profile and key strengths.
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <Textarea
          id="summary"
          label="Summary"
          placeholder="Product manager with 7+ years of experience in B2B SaaS..."
          className={cn(
            getWarningMessage(errors.summary?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(errors.summary?.message)}
          helperTone="warning"
          {...register("summary")}
        />
        <p className="text-xs text-app-muted">
          {summaryValue.length} characters
        </p>
      </div>
    </section>
  );
}
