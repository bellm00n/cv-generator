import { useController, useFormContext } from "react-hook-form";
import { Chips } from "@/components/ui/Chips";
import type { CvFormValues } from "@/schemas/formSchema";
import { getArrayWarning } from "./editorUtils";

export function SkillsSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const { field } = useController({ control, name: "skills" });

  return (
    <section className="py-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Skills</h3>
        <p className="text-xs text-slate-500">
          Type a skill and press Enter to add it.
        </p>
      </div>

      <div className="mt-3">
        <Chips
          id="skills"
          label="Skills"
          hideLabel
          placeholder="Stakeholder management"
          values={field.value.map((item) => item.value)}
          onAdd={(value) => {
            field.onChange([...field.value, { value }]);
          }}
          onRemove={(index) => {
            field.onChange(field.value.filter((_, i) => i !== index));
          }}
          helperText={getArrayWarning(errors.skills)}
          helperTone="warning"
        />
      </div>
    </section>
  );
}
