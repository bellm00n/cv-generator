import type { KeyboardEvent } from "react";
import type { FieldErrors } from "react-hook-form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createEmptyListItem, type CvFormValues } from "@/schemas/formSchema";
import {
  WARNING_INPUT_CLASS,
  getArrayWarning,
  getWarningMessage,
} from "./editorUtils";

export function LanguagesSection() {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const languagesArray = useFieldArray({ control, name: "languages" });

  const handleLanguageKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const value = getValues(`languages.${index}.value`);
    if (!value?.trim()) return;

    languagesArray.insert(index + 1, createEmptyListItem());
    requestAnimationFrame(() => {
      document.getElementById(`language-${index + 1}`)?.focus();
    });
  };

  return (
    <section className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold">Languages</h3>
          <p className="text-xs text-app-muted">
            Add one per row. Press Enter to add a new row.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => languagesArray.append(createEmptyListItem())}
        >
          Add language
        </Button>
      </div>

      <div className="mt-3 space-y-2">
        {languagesArray.fields.map((language, index) => {
          const languageWarning = getWarningMessage(
            (
              errors.languages as
                | FieldErrors<CvFormValues["languages"][number]>[]
                | undefined
            )?.[index]?.value?.message,
          );

          return (
            <div key={language.id} className="flex flex-wrap items-start gap-2">
              <div className="min-w-56 flex-1">
                <Input
                  id={`language-${index}`}
                  label={`Language ${index + 1}`}
                  hideLabel
                  aria-label={`Language ${index + 1}`}
                  placeholder="English (C2)"
                  className={cn(
                    languageWarning ? WARNING_INPUT_CLASS : undefined,
                  )}
                  helperText={languageWarning}
                  helperTone="warning"
                  {...register(`languages.${index}.value` as const)}
                  onKeyDown={(e) => handleLanguageKeyDown(e, index)}
                />
              </div>
              <Button
                variant="destructive"
                className="h-9 px-3"
                onClick={() => languagesArray.remove(index)}
              >
                Delete
              </Button>
            </div>
          );
        })}

        {getArrayWarning(errors.languages) ? (
          <p className="text-xs text-amber-700">
            {getArrayWarning(errors.languages)}
          </p>
        ) : null}

        {languagesArray.fields.length === 0 ? (
          <p className="text-xs text-app-muted">No languages added yet.</p>
        ) : null}
      </div>
    </section>
  );
}
