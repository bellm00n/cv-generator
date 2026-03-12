"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/cn";
import {
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
  cvTitle?: string;
  initialFormValues?: CvFormValues;
  onCvDataChange?: (cvData: CvDocument) => void;
  onSave?: (values: CvFormValues) => Promise<void>;
};

const AUTOSAVE_DELAY_MS = 1500;

export function EditorPanel({
  className,
  cvTitle,
  initialFormValues,
  onCvDataChange,
  onSave,
}: EditorPanelProps) {
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  const onCvDataChangeRef = useRef(onCvDataChange);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onCvDataChangeRef.current = onCvDataChange;
  }, [onCvDataChange]);

  const methods = useForm<CvFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: initialFormValues ?? createDefaultCvFormValues(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { getValues, watch } = methods;

  useEffect(() => {
    onCvDataChangeRef.current?.(cvDocumentSchema.parse(getValues()));
  }, [getValues]);

  useEffect(() => {
    const subscription = watch(() => {
      onCvDataChangeRef.current?.(cvDocumentSchema.parse(getValues()));

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      autosaveTimeoutRef.current = setTimeout(() => {
        void onSaveRef.current?.(getValues());
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [getValues, watch]);

  return (
    <FormProvider {...methods}>
      <section
        className={cn("rounded-lg bg-white p-rhythm", className)}
        aria-labelledby="editor-panel-title"
      >
        <div className="space-y-1">
          <h2 id="editor-panel-title" className="text-xl">
            Editor Panel{cvTitle ? ` (${cvTitle})` : ""}
          </h2>
        </div>

        <form
          className="mt-rhythm divide-y divide-slate-300/50"
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
