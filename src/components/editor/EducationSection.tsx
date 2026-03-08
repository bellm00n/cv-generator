import type { FieldErrors } from "react-hook-form";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { createEmptyEducationItem, type CvFormValues } from "@/lib/schemas";
import {
  WARNING_INPUT_CLASS,
  getArrayWarning,
  getWarningMessage,
} from "./editorUtils";

export function EducationSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const educationArray = useFieldArray({ control, name: "education" });

  return (
    <section className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Education</h3>
          <p className="text-xs text-app-muted">Add your education history.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => educationArray.append(createEmptyEducationItem())}
        >
          Add item
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        {educationArray.fields.map((item, index) => {
          const educationErrors = (
            errors.education as
              | FieldErrors<CvFormValues["education"][number]>[]
              | undefined
          )?.[index];

          return (
            <Card key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-medium">
                  Education item {index + 1}
                </h4>
                <Button
                  variant="destructive"
                  onClick={() => educationArray.remove(index)}
                >
                  Remove item
                </Button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input
                  id={`education-degree-${index}`}
                  label="Degree"
                  placeholder="B.Sc. Computer Science"
                  className={cn(
                    getWarningMessage(educationErrors?.degree?.message)
                      ? WARNING_INPUT_CLASS
                      : undefined,
                  )}
                  helperText={getWarningMessage(
                    educationErrors?.degree?.message,
                  )}
                  helperTone="warning"
                  {...register(`education.${index}.degree` as const)}
                />
                <Input
                  id={`education-university-${index}`}
                  label="University"
                  placeholder="University of California"
                  className={cn(
                    getWarningMessage(educationErrors?.university?.message)
                      ? WARNING_INPUT_CLASS
                      : undefined,
                  )}
                  helperText={getWarningMessage(
                    educationErrors?.university?.message,
                  )}
                  helperTone="warning"
                  {...register(`education.${index}.university` as const)}
                />
                <Controller
                  control={control}
                  name={`education.${index}.startDate` as const}
                  render={({ field }) => (
                    <MonthPicker
                      id={`education-start-${index}`}
                      label="Start date"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className={cn(
                        getWarningMessage(educationErrors?.startDate?.message)
                          ? WARNING_INPUT_CLASS
                          : undefined,
                      )}
                      helperText={getWarningMessage(
                        educationErrors?.startDate?.message,
                      )}
                      helperTone="warning"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`education.${index}.endDate` as const}
                  render={({ field }) => (
                    <MonthPicker
                      id={`education-end-${index}`}
                      label="End date"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className={cn(
                        getWarningMessage(educationErrors?.endDate?.message)
                          ? WARNING_INPUT_CLASS
                          : undefined,
                      )}
                      helperText={getWarningMessage(
                        educationErrors?.endDate?.message,
                      )}
                      helperTone="warning"
                    />
                  )}
                />
              </div>
            </Card>
          );
        })}

        {getArrayWarning(errors.education) ? (
          <p className="text-xs text-amber-700">
            {getArrayWarning(errors.education)}
          </p>
        ) : null}

        {educationArray.fields.length === 0 ? (
          <p className="text-xs text-app-muted">
            No education items added yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}
