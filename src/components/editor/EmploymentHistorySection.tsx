import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  createEmptyEmploymentItem,
  type CvFormValues,
} from "@/schemas/formSchema";
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
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Employment history</h3>
        <p className="text-xs text-slate-500">
          Add your roles from most relevant to least relevant.
        </p>
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

        <Button
          color="secondary"
          variant="outlined"
          onClick={() => employmentArray.append(createEmptyEmploymentItem())}
        >
          Add item
        </Button>
      </div>
    </section>
  );
}
