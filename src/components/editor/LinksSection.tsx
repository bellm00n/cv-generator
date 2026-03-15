import type { FieldErrors } from "react-hook-form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createEmptyLinkItem, type CvFormValues } from "@/schemas/formSchema";
import { WARNING_INPUT_CLASS, getWarningMessage } from "./editorUtils";

export function LinksSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CvFormValues>();

  const linksArray = useFieldArray({ control, name: "links" });

  return (
    <section className="py-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Links</h3>
        <p className="text-xs text-slate-500">
          Add links to your profiles and portfolio.
        </p>
      </div>

      <div className="mt-3 space-y-3">
        {linksArray.fields.map((item, index) => {
          const linkErrors = (
            errors.links as
              | FieldErrors<CvFormValues["links"][number]>[]
              | undefined
          )?.[index];

          return (
            <Card key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-medium">Link {index + 1}</h4>
                <Button
                  color="destructive"
                  variant="outlined"
                  onClick={() => linksArray.remove(index)}
                >
                  Remove link
                </Button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input
                  id={`link-label-${index}`}
                  label="Link label"
                  placeholder="LinkedIn"
                  className={cn(
                    getWarningMessage(linkErrors?.label?.message)
                      ? WARNING_INPUT_CLASS
                      : undefined,
                  )}
                  helperText={getWarningMessage(linkErrors?.label?.message)}
                  helperTone="warning"
                  {...register(`links.${index}.label` as const)}
                />
                <Input
                  id={`link-url-${index}`}
                  label="Link"
                  placeholder="https://linkedin.com/in/username"
                  className={cn(
                    getWarningMessage(linkErrors?.url?.message)
                      ? WARNING_INPUT_CLASS
                      : undefined,
                  )}
                  helperText={getWarningMessage(linkErrors?.url?.message)}
                  helperTone="warning"
                  {...register(`links.${index}.url` as const)}
                />
              </div>
            </Card>
          );
        })}

        <Button
          color="secondary"
          variant="outlined"
          onClick={() => linksArray.append(createEmptyLinkItem())}
        >
          Add link
        </Button>
      </div>
    </section>
  );
}
