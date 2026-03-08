import type { FieldErrors } from "react-hook-form";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import type { CvFormValues } from "@/schemas/formSchema";
import { WARNING_INPUT_CLASS, getWarningMessage } from "./editorUtils";

type EmploymentItemCardProps = {
  index: number;
  onRemove: () => void;
};

export function EmploymentItemCard({
  index,
  onRemove,
}: EmploymentItemCardProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const itemErrors = (
    errors.employmentHistory as
      | FieldErrors<CvFormValues["employmentHistory"][number]>[]
      | undefined
  )?.[index];

  const currentlyWorking = useWatch({
    control,
    name: `employmentHistory.${index}.currentlyWorking` as const,
  });

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-medium">Employment item {index + 1}</h4>
        <Button variant="destructive" onClick={onRemove}>
          Remove item
        </Button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Input
          id={`employment-title-${index}`}
          label="Title"
          placeholder="Senior Product Designer"
          className={cn(
            getWarningMessage(itemErrors?.title?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(itemErrors?.title?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.title` as const)}
        />
        <Input
          id={`employment-company-${index}`}
          label="Company name"
          placeholder="Acme Corp"
          className={cn(
            getWarningMessage(itemErrors?.company?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(itemErrors?.company?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.company` as const)}
        />
        <Input
          id={`employment-location-${index}`}
          label="Location (optional)"
          placeholder="Krakow"
          {...register(`employmentHistory.${index}.location` as const)}
        />
      </div>

      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] items-end gap-3">
        <Controller
          control={control}
          name={`employmentHistory.${index}.startDate` as const}
          render={({ field }) => (
            <MonthPicker
              id={`employment-start-${index}`}
              label="Start date"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={cn(
                getWarningMessage(itemErrors?.startDate?.message)
                  ? WARNING_INPUT_CLASS
                  : undefined,
              )}
              helperText={getWarningMessage(itemErrors?.startDate?.message)}
              helperTone="warning"
            />
          )}
        />
        <Controller
          control={control}
          name={`employmentHistory.${index}.endDate` as const}
          render={({ field }) => (
            <MonthPicker
              id={`employment-end-${index}`}
              label="End date"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={currentlyWorking}
              className={cn(
                getWarningMessage(itemErrors?.endDate?.message)
                  ? WARNING_INPUT_CLASS
                  : undefined,
              )}
              helperText={getWarningMessage(itemErrors?.endDate?.message)}
              helperTone="warning"
            />
          )}
        />
        <div className="pb-0.5">
          <Checkbox
            id={`employment-present-${index}`}
            label="Present"
            {...register(
              `employmentHistory.${index}.currentlyWorking` as const,
              {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setValue(`employmentHistory.${index}.endDate`, "", {
                      shouldDirty: true,
                    });
                  }
                },
              },
            )}
          />
        </div>
      </div>

      <div className="mt-3">
        <Textarea
          id={`employment-description-${index}`}
          label="Description"
          rows={3}
          placeholder="Built and launched a feature that improved conversion by 14%."
          className={cn(
            getWarningMessage(itemErrors?.description?.message)
              ? WARNING_INPUT_CLASS
              : undefined,
          )}
          helperText={getWarningMessage(itemErrors?.description?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.description` as const)}
        />
      </div>
    </Card>
  );
}
