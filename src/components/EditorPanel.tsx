"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
  useForm
} from "react-hook-form";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  CV_FORM_STORAGE_KEY,
  createDefaultCvFormValues,
  createEmptyEducationItem,
  createEmptyEmploymentItem,
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
  register: UseFormRegister<CvFormValues>;
  errors: FieldErrors<CvFormValues>;
  onRemove: () => void;
};

function EmploymentItemCard({
  index,
  register,
  errors,
  onRemove
}: EmploymentItemCardProps) {
  const itemErrors = (
    errors.employmentHistory as FieldErrors<CvFormValues["employmentHistory"][number]>[] | undefined
  )?.[index];

  return (
    <article className="rounded-md border border-app-border/90 bg-white/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-base">Employment item {index + 1}</h4>
        <Button variant="destructive" onClick={onRemove}>
          Remove item
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
          label="End date (optional)"
          placeholder="Leave empty if current"
          className={cn(
            getWarningMessage(itemErrors?.endDate?.message) ? WARNING_INPUT_CLASS : undefined
          )}
          helperText={getWarningMessage(itemErrors?.endDate?.message)}
          helperTone="warning"
          {...register(`employmentHistory.${index}.endDate` as const)}
        />
      </div>

      <div className="mt-4">
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

  return (
    <section
      className={cn(
        "rounded-lg border border-app-border bg-app-surface p-rhythm",
        className
      )}
      aria-labelledby="editor-panel-title"
    >
      <div className="space-y-2">
        <h2 id="editor-panel-title" className="text-xl">
          Editor Panel
        </h2>
      </div>

      <form className="mt-rhythm space-y-rhythm" noValidate onSubmit={(event) => event.preventDefault()}>
        <section className="p-4">
          <div className="space-y-1">
            <h3 className="text-base">Personal details</h3>
            <p className="text-sm text-app-muted">Contact and headline information.</p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

        <section className="p-4">
          <div className="space-y-1">
            <h3 className="text-base">Summary</h3>
            <p className="text-sm text-app-muted">
              Briefly describe your profile and key strengths.
            </p>
          </div>

          <div className="mt-4 space-y-2">
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

        <section className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base">Skills</h3>
              <p className="text-sm text-app-muted">Add one skill per row.</p>
            </div>
            <Button variant="secondary" onClick={() => skillsArray.append(createEmptyListItem())}>
              Add skill
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {skillsArray.fields.map((skill, index) => {
              const skillWarning = getWarningMessage(
                (
                  errors.skills as
                    | FieldErrors<CvFormValues["skills"][number]>[]
                    | undefined
                )?.[index]?.value?.message
              );

              return (
                <div key={skill.id} className="flex flex-wrap items-start gap-3">
                  <div className="min-w-[14rem] flex-1">
                    <Input
                      id={`skill-${index}`}
                      label={`Skill ${index + 1}`}
                      hideLabel
                      aria-label={`Skill ${index + 1}`}
                      placeholder="Stakeholder management"
                      className={cn(skillWarning ? WARNING_INPUT_CLASS : undefined)}
                      helperText={skillWarning}
                      helperTone="warning"
                      {...register(`skills.${index}.value` as const)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    className="h-11 px-4"
                    onClick={() => skillsArray.remove(index)}
                  >
                    Delete
                  </Button>
                </div>
              );
            })}

            {getArrayWarning(errors.skills) ? (
              <p className="text-xs text-amber-700">{getArrayWarning(errors.skills)}</p>
            ) : null}

            {skillsArray.fields.length === 0 ? (
              <p className="text-xs text-app-muted">No skills added yet.</p>
            ) : null}
          </div>
        </section>

        <section className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base">Languages</h3>
              <p className="text-sm text-app-muted">Add one language per row.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => languagesArray.append(createEmptyListItem())}
            >
              Add language
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {languagesArray.fields.map((language, index) => {
              const languageWarning = getWarningMessage(
                (
                  errors.languages as
                    | FieldErrors<CvFormValues["languages"][number]>[]
                    | undefined
                )?.[index]?.value?.message
              );

              return (
                <div key={language.id} className="flex flex-wrap items-start gap-3">
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
                    />
                  </div>
                  <Button
                    variant="destructive"
                    className="h-11 px-4"
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

        <section className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base">Employment history</h3>
              <p className="text-sm text-app-muted">Add your roles from most relevant to least relevant.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => employmentArray.append(createEmptyEmploymentItem())}
            >
              Add item
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {employmentArray.fields.map((item, index) => (
              <EmploymentItemCard
                key={item.id}
                index={index}
                register={register}
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

        <section className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base">Education</h3>
              <p className="text-sm text-app-muted">Add your education history.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => educationArray.append(createEmptyEducationItem())}
            >
              Add item
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {educationArray.fields.map((item, index) => {
              const educationErrors = (
                errors.education as FieldErrors<CvFormValues["education"][number]>[] | undefined
              )?.[index];

              return (
                <article
                  key={item.id}
                  className="rounded-md border border-app-border/90 bg-white/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-base">Education item {index + 1}</h4>
                    <Button
                      variant="destructive"
                      onClick={() => educationArray.remove(index)}
                    >
                      Remove item
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
