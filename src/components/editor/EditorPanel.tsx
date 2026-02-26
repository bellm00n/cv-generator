"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  useFieldArray,
  useForm,
  useWatch
} from "react-hook-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chips } from "@/components/ui/Chips";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  CV_FORM_STORAGE_KEY,
  createDefaultCvFormValues,
  createEmptyEducationItem,
  createEmptyEmploymentItem,
  createEmptyLinkItem,
  createEmptyListItem,
  cvFormSchema,
  mapCvFormValuesToDocument,
  type CvFormValues,
  normalizePersistedCvForm
} from "@/lib/cvForm";
import type { CvDocument } from "@/types/cv";

type EditorPanelProps = {
  className?: string;
  onCvDataChange?: (cvData: CvDocument) => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

const WARNING_INPUT_CLASS = "border-amber-300 focus-visible:ring-amber-300/40";
const AUTOSAVE_DELAY_MS = 400;

const getWarningMessage = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const getArrayWarning = (error: unknown): string | undefined => {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return undefined;
  }

  return getWarningMessage((error as { message?: unknown }).message);
};

type EmploymentItemCardProps = {
  index: number;
  control: Control<CvFormValues>;
  register: UseFormRegister<CvFormValues>;
  setValue: UseFormSetValue<CvFormValues>;
  errors: FieldErrors<CvFormValues>;
  onRemove: () => void;
};

function EmploymentItemCard({
  index,
  control,
  register,
  setValue,
  errors,
  onRemove
}: EmploymentItemCardProps) {
  const itemErrors = (
    errors.employmentHistory as FieldErrors<CvFormValues["employmentHistory"][number]>[] | undefined
  )?.[index];

  const currentlyWorking = useWatch({
    control,
    name: `employmentHistory.${index}.currentlyWorking` as const
  });

  return (
    <article className="rounded-md border-l-2 border-app-accent/30 bg-gray-50/50 p-3">
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
            getWarningMessage(itemErrors?.title?.message) ? WARNING_INPUT_CLASS : undefined
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
            getWarningMessage(itemErrors?.company?.message) ? WARNING_INPUT_CLASS : undefined
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
        <Input
          id={`employment-start-${index}`}
          type="month"
          label="Start date"
          className={cn(
            getWarningMessage(itemErrors?.startDate?.message)
              ? WARNING_INPUT_CLASS
              : undefined
          )}
          helperText={getWarningMessage(itemErrors?.startDate?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.startDate` as const)}
        />
        <Input
          id={`employment-end-${index}`}
          type="month"
          label="End date"
          disabled={currentlyWorking}
          className={cn(
            currentlyWorking && "opacity-50",
            getWarningMessage(itemErrors?.endDate?.message) ? WARNING_INPUT_CLASS : undefined
          )}
          helperText={getWarningMessage(itemErrors?.endDate?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.endDate` as const)}
        />
        <div className="pb-0.5">
          <Checkbox
            id={`employment-present-${index}`}
            label="Present"
            {...register(`employmentHistory.${index}.currentlyWorking` as const, {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  setValue(`employmentHistory.${index}.endDate`, "", {
                    shouldDirty: true
                  });
                }
              }
            })}
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
              : undefined
          )}
          helperText={getWarningMessage(itemErrors?.description?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.description` as const)}
        />
      </div>
    </article>
  );
}

export function EditorPanel({
  className,
  onCvDataChange,
  onDirtyChange
}: EditorPanelProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    getValues,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<CvFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: createDefaultCvFormValues(),
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const skillsArray = useFieldArray({
    control,
    name: "skills"
  });

  const languagesArray = useFieldArray({
    control,
    name: "languages"
  });

  const employmentArray = useFieldArray({
    control,
    name: "employmentHistory"
  });

  const educationArray = useFieldArray({
    control,
    name: "education"
  });

  const linksArray = useFieldArray({
    control,
    name: "links"
  });

  const summaryValue = watch("summary") ?? "";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistedValue = window.localStorage.getItem(CV_FORM_STORAGE_KEY);
    if (!persistedValue) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsedValue = JSON.parse(persistedValue) as unknown;
      const normalizedForm = normalizePersistedCvForm(parsedValue);

      if (normalizedForm) {
        reset(normalizedForm);
      } else {
        window.localStorage.removeItem(CV_FORM_STORAGE_KEY);
      }
    } catch {
      window.localStorage.removeItem(CV_FORM_STORAGE_KEY);
    }

    setIsHydrated(true);
  }, [reset]);

  useEffect(() => {
    if (!isHydrated || !onCvDataChange) {
      return;
    }

    onCvDataChange(mapCvFormValuesToDocument(getValues()));
  }, [getValues, isHydrated, onCvDataChange]);

  useEffect(() => {
    if (!isHydrated || !onDirtyChange) {
      return;
    }

    onDirtyChange(isDirty);
  }, [isDirty, isHydrated, onDirtyChange]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    const subscription = watch((value) => {
      if (onCvDataChange) {
        onCvDataChange(mapCvFormValuesToDocument(getValues()));
      }

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      autosaveTimeoutRef.current = setTimeout(() => {
        window.localStorage.setItem(CV_FORM_STORAGE_KEY, JSON.stringify(value));
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [getValues, isHydrated, onCvDataChange, watch]);

  const handleLanguageKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
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
    <section
      className={cn(
        "rounded-lg bg-app-surface p-rhythm",
        className
      )}
      aria-labelledby="editor-panel-title"
    >
      <div className="space-y-1">
        <h2 id="editor-panel-title" className="text-xl">
          Editor Panel
        </h2>
      </div>

      <form className="mt-rhythm divide-y divide-app-border/50" noValidate onSubmit={(event) => event.preventDefault()}>
        <section className="pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">Personal details</h3>
            <p className="text-xs text-app-muted">Contact and headline information.</p>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input
              id="name"
              label="Name"
              placeholder="Alex"
              className={cn(
                getWarningMessage(errors.name?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.name?.message)}
              helperTone="warning"
              {...register("name")}
            />
            <Input
              id="surname"
              label="Surname"
              placeholder="Johnson"
              className={cn(
                getWarningMessage(errors.surname?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.surname?.message)}
              helperTone="warning"
              {...register("surname")}
            />
            <Input
              id="profile-title"
              label="Title"
              placeholder="Product Manager"
              className={cn(
                getWarningMessage(errors.title?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.title?.message)}
              helperTone="warning"
              {...register("title")}
            />
            <Input
              id="country"
              label="Country"
              placeholder="United States"
              className={cn(
                getWarningMessage(errors.country?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.country?.message)}
              helperTone="warning"
              {...register("country")}
            />
            <Input
              id="city"
              label="City"
              placeholder="San Francisco"
              className={cn(
                getWarningMessage(errors.city?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.city?.message)}
              helperTone="warning"
              {...register("city")}
            />
            <Input
              id="number"
              label="Number"
              placeholder="+1 555 123 4567"
              className={cn(
                getWarningMessage(errors.phone?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.phone?.message)}
              helperTone="warning"
              {...register("phone")}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="alex@example.com"
              className={cn(
                getWarningMessage(errors.email?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.email?.message)}
              helperTone="warning"
              {...register("email")}
            />
          </div>
        </section>

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
                getWarningMessage(errors.summary?.message) ? WARNING_INPUT_CLASS : undefined
              )}
              helperText={getWarningMessage(errors.summary?.message)}
              helperTone="warning"
              {...register("summary")}
            />
            <p className="text-xs text-app-muted">{summaryValue.length} characters</p>
          </div>
        </section>

        <section className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold">Links</h3>
              <p className="text-xs text-app-muted">Add links to your profiles and portfolio.</p>
            </div>
            <Button variant="secondary" onClick={() => linksArray.append(createEmptyLinkItem())}>
              Add link
            </Button>
          </div>

          <div className="mt-3 space-y-3">
            {linksArray.fields.map((item, index) => {
              const linkErrors = (
                errors.links as FieldErrors<CvFormValues["links"][number]>[] | undefined
              )?.[index];

              return (
                <article
                  key={item.id}
                  className="rounded-md border-l-2 border-app-accent/30 bg-gray-50/50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-medium">Link {index + 1}</h4>
                    <Button
                      variant="destructive"
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
                          : undefined
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
                          : undefined
                      )}
                      helperText={getWarningMessage(linkErrors?.url?.message)}
                      helperTone="warning"
                      {...register(`links.${index}.url` as const)}
                    />
                  </div>
                </article>
              );
            })}

            {linksArray.fields.length === 0 ? (
              <p className="text-xs text-app-muted">No links added yet.</p>
            ) : null}
          </div>
        </section>

        <section className="py-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">Skills</h3>
            <p className="text-xs text-app-muted">Type a skill and press Enter to add it.</p>
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

        <section className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold">Languages</h3>
              <p className="text-xs text-app-muted">Add one per row. Press Enter to add a new row.</p>
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
                )?.[index]?.value?.message
              );

              return (
                <div key={language.id} className="flex flex-wrap items-start gap-2">
                  <div className="min-w-[14rem] flex-1">
                    <Input
                      id={`language-${index}`}
                      label={`Language ${index + 1}`}
                      hideLabel
                      aria-label={`Language ${index + 1}`}
                      placeholder="English (C2)"
                      className={cn(languageWarning ? WARNING_INPUT_CLASS : undefined)}
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
              <p className="text-xs text-amber-700">{getArrayWarning(errors.languages)}</p>
            ) : null}

            {languagesArray.fields.length === 0 ? (
              <p className="text-xs text-app-muted">No languages added yet.</p>
            ) : null}
          </div>
        </section>

        <section className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold">Employment history</h3>
              <p className="text-xs text-app-muted">Add your roles from most relevant to least relevant.</p>
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
                control={control}
                register={register}
                setValue={setValue}
                errors={errors}
                onRemove={() => employmentArray.remove(index)}
              />
            ))}

            {getArrayWarning(errors.employmentHistory) ? (
              <p className="text-xs text-amber-700">
                {getArrayWarning(errors.employmentHistory)}
              </p>
            ) : null}

            {employmentArray.fields.length === 0 ? (
              <p className="text-xs text-app-muted">No employment items added yet.</p>
            ) : null}
          </div>
        </section>

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
                errors.education as FieldErrors<CvFormValues["education"][number]>[] | undefined
              )?.[index];

              return (
                <article
                  key={item.id}
                  className="rounded-md border-l-2 border-app-accent/30 bg-gray-50/50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-medium">Education item {index + 1}</h4>
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
                          : undefined
                      )}
                      helperText={getWarningMessage(educationErrors?.degree?.message)}
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
                          : undefined
                      )}
                      helperText={getWarningMessage(educationErrors?.university?.message)}
                      helperTone="warning"
                      {...register(`education.${index}.university` as const)}
                    />
                    <Input
                      id={`education-start-${index}`}
                      type="month"
                      label="Start date"
                      className={cn(
                        getWarningMessage(educationErrors?.startDate?.message)
                          ? WARNING_INPUT_CLASS
                          : undefined
                      )}
                      helperText={getWarningMessage(educationErrors?.startDate?.message)}
                      helperTone="warning"
                      {...register(`education.${index}.startDate` as const)}
                    />
                    <Input
                      id={`education-end-${index}`}
                      type="month"
                      label="End date"
                      className={cn(
                        getWarningMessage(educationErrors?.endDate?.message)
                          ? WARNING_INPUT_CLASS
                          : undefined
                      )}
                      helperText={getWarningMessage(educationErrors?.endDate?.message)}
                      helperTone="warning"
                      {...register(`education.${index}.endDate` as const)}
                    />
                  </div>
                </article>
              );
            })}

            {getArrayWarning(errors.education) ? (
              <p className="text-xs text-amber-700">{getArrayWarning(errors.education)}</p>
            ) : null}

            {educationArray.fields.length === 0 ? (
              <p className="text-xs text-app-muted">No education items added yet.</p>
            ) : null}
          </div>
        </section>
      </form>
    </section>
  );
}
