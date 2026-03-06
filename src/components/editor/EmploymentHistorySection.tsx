import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { createEmptyEmploymentItem, type CvFormValues } from "@/lib/schemas";
import { EmploymentItemCard } from "./EmploymentItemCard";
import { getArrayWarning } from "./editorUtils";

export function EmploymentHistorySection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const employmentArray = useFieldArray({ control, name: "employmentHistory" });

  return (
    <section className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Employment history</h3>
          <p className="text-xs text-app-muted">
            Add your roles from most relevant to least relevant.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => employmentArray.append(createEmptyEmploymentItem())}
        >
          Add item
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        {employmentArray.fields.map((item, index) => (
          <EmploymentItemCard
            key={item.id}
            index={index}
            onRemove={() => employmentArray.remove(index)}
          />
        ))}

        {getArrayWarning(errors.employmentHistory) ? (
          <p className="text-xs text-amber-700">
            {getArrayWarning(errors.employmentHistory)}
          </p>
        ) : null}

        {employmentArray.fields.length === 0 ? (
          <p className="text-xs text-app-muted">
            No employment items added yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}
