import { useFieldArray, useFormContext } from "react-hook-form";
import { Chips } from "@/components/ui/Chips";
import type { CvFormValues } from "@/schemas/formSchema";
import { getArrayWarning } from "./editorUtils";

export function SkillsSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const skillsArray = useFieldArray({ control, name: "skills" });

  return (
    <section className="py-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Skills</h3>
        <p className="text-xs text-app-muted">
          Type a skill and press Enter to add it.
        </p>
      </div>

      <div className="mt-3">
        <Chips
          id="skills"
          label="Skills"
          hideLabel
          placeholder="Stakeholder management"
          values={skillsArray.fields.map((field) => field.value)}
          onAdd={(value) => skillsArray.append({ value })}
          onRemove={(index) => skillsArray.remove(index)}
          helperText={getArrayWarning(errors.skills)}
          helperTone="warning"
        />
      </div>
    </section>
  );
}
