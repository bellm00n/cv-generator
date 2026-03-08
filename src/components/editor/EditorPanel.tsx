"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/cn";
import { parseImportedCv } from "@/schemas/cvImportSchema";
import {
  CV_FORM_STORAGE_KEY,
  createDefaultCvFormValues,
  cvFormSchema,
  type CvFormValues,
} from "@/schemas/formSchema";
import { cvDocumentSchema } from "@/schemas/documentSchema";
import type { CvDocument } from "@/types/cv";
import { EducationSection } from "./EducationSection";
import { EmploymentHistorySection } from "./EmploymentHistorySection";
import { LanguagesSection } from "./LanguagesSection";
import { LinksSection } from "./LinksSection";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { SkillsSection } from "./SkillsSection";
import { SummarySection } from "./SummarySection";

type EditorPanelProps = {
  className?: string;
  onCvDataChange?: (cvData: CvDocument) => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

const AUTOSAVE_DELAY_MS = 400;

export function EditorPanel({
  className,
  onCvDataChange,
  onDirtyChange,
}: EditorPanelProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const methods = useForm<CvFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: createDefaultCvFormValues(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const {
    getValues,
    reset,
    watch,
    formState: { isDirty },
  } = methods;

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
      const normalizedForm = parseImportedCv(parsedValue);

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

    onCvDataChange(cvDocumentSchema.parse(getValues()));
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
        onCvDataChange(cvDocumentSchema.parse(getValues()));
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
    <FormProvider {...methods}>
      <section
        className={cn("rounded-lg bg-app-surface p-rhythm", className)}
        aria-labelledby="editor-panel-title"
      >
        <div className="space-y-1">
          <h2 id="editor-panel-title" className="text-xl">
            Editor Panel
          </h2>
        </div>

        <form
          className="divide-app-border/50 mt-rhythm divide-y"
          noValidate
          onSubmit={(event) => event.preventDefault()}
        >
          <PersonalDetailsSection />
          <SummarySection />
          <LinksSection />
          <SkillsSection />
          <LanguagesSection />
          <EmploymentHistorySection />
          <EducationSection />
        </form>
      </section>
    </FormProvider>
  );
}
