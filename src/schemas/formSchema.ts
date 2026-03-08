import { z } from "zod";

const REQUIRED_WARNING = "This field is recommended.";
export const CV_FORM_STORAGE_KEY = "cv-generator:editor-form:v1";

export const cvListItemSchema = z.object({
  value: z.string().trim().min(1, "Add a value or remove this row."),
});

const linkItemSchema = z.object({
  label: z.string().trim().min(1, REQUIRED_WARNING),
  url: z
    .string()
    .trim()
    .min(1, REQUIRED_WARNING)
    .url("Use a valid URL, for example https://linkedin.com/in/username."),
});

const employmentItemSchema = z.object({
  title: z.string().trim().min(1, REQUIRED_WARNING),
  company: z.string().trim().min(1, REQUIRED_WARNING),
  location: z.string().trim(),
  startDate: z.string().trim().min(1, REQUIRED_WARNING),
  endDate: z.string().trim(),
  currentlyWorking: z.boolean(),
  description: z.string().trim().min(1, REQUIRED_WARNING),
});

const educationItemSchema = z.object({
  degree: z.string().trim().min(1, REQUIRED_WARNING),
  university: z.string().trim().min(1, REQUIRED_WARNING),
  startDate: z.string().trim().min(1, REQUIRED_WARNING),
  endDate: z.string().trim().min(1, REQUIRED_WARNING),
});

export const cvFormSchema = z.object({
  name: z.string().trim().min(1, REQUIRED_WARNING),
  surname: z.string().trim().min(1, REQUIRED_WARNING),
  title: z.string().trim().min(1, REQUIRED_WARNING),
  country: z.string().trim().min(1, REQUIRED_WARNING),
  city: z.string().trim().min(1, REQUIRED_WARNING),
  phone: z.string().trim().min(1, REQUIRED_WARNING),
  email: z
    .string()
    .trim()
    .min(1, REQUIRED_WARNING)
    .email("Use a valid email format, for example name@example.com."),
  summary: z.string().trim().min(1, REQUIRED_WARNING),
  links: z.array(linkItemSchema),
  skills: z.array(cvListItemSchema).min(1, "Add at least one skill."),
  languages: z.array(cvListItemSchema).min(1, "Add at least one language."),
  employmentHistory: z
    .array(employmentItemSchema)
    .min(1, "Add at least one employment item."),
  education: z
    .array(educationItemSchema)
    .min(1, "Add at least one education item."),
});

export type CvFormValues = z.infer<typeof cvFormSchema>;

export function createEmptyListItem(): CvFormValues["skills"][number] {
  return { value: "" };
}

export function createEmptyLinkItem(): CvFormValues["links"][number] {
  return { label: "", url: "" };
}

export function createEmptyEmploymentItem(): CvFormValues["employmentHistory"][number] {
  return {
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  };
}

export function createEmptyEducationItem(): CvFormValues["education"][number] {
  return {
    degree: "",
    university: "",
    startDate: "",
    endDate: "",
  };
}

export function createDefaultCvFormValues(): CvFormValues {
  return {
    name: "",
    surname: "",
    title: "",
    country: "",
    city: "",
    phone: "",
    email: "",
    summary: "",
    links: [],
    skills: [createEmptyListItem()],
    languages: [createEmptyListItem()],
    employmentHistory: [createEmptyEmploymentItem()],
    education: [createEmptyEducationItem()],
  };
}
