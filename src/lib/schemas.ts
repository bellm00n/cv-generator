import { z } from "zod";

const REQUIRED_WARNING = "This field is recommended.";
export const CV_FORM_STORAGE_KEY = "cv-generator:editor-form:v1";
const cvItemIdSchema = z.string().trim().min(1, "Invalid identifier.");
const cvItemOrderSchema = z.number().int().positive("Invalid order.");

const cvLinkIdSchema = cvItemIdSchema.brand<"CvLinkId">();
const cvEmploymentIdSchema = cvItemIdSchema.brand<"CvEmploymentId">();
const cvEducationIdSchema = cvItemIdSchema.brand<"CvEducationId">();

export type CvLinkId = z.infer<typeof cvLinkIdSchema>;
export type CvEmploymentId = z.infer<typeof cvEmploymentIdSchema>;
export type CvEducationId = z.infer<typeof cvEducationIdSchema>;

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

export const cvUploadSchema = z
  .object({
    name: z.string().optional(),
    surname: z.string().optional(),
    fullName: z.string().optional(),
    title: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    number: z.string().optional(),
    email: z.string().optional(),
    summary: z.string().optional(),
    contact: z
      .object({
        country: z.string().optional(),
        city: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      })
      .optional(),
    links: z.array(z.unknown()).optional(),
    skills: z.array(z.unknown()).optional(),
    languages: z.array(z.unknown()).optional(),
    employmentHistory: z.array(z.unknown()).optional(),
    education: z.array(z.unknown()).optional(),
  })
  .passthrough()
  .refine((data) => {
    const hasIdentity = Boolean(data.name || data.fullName);
    const hasContent = Boolean(
      data.title ||
      data.summary ||
      data.skills?.length ||
      data.employmentHistory?.length ||
      data.education?.length,
    );
    return hasIdentity || hasContent;
  });

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

export function createCvLinkId(order: number): CvLinkId {
  return cvLinkIdSchema.parse(`link-${cvItemOrderSchema.parse(order)}`);
}

export function createCvEmploymentId(order: number): CvEmploymentId {
  return cvEmploymentIdSchema.parse(
    `employment-${cvItemOrderSchema.parse(order)}`,
  );
}

export function createCvEducationId(order: number): CvEducationId {
  return cvEducationIdSchema.parse(
    `education-${cvItemOrderSchema.parse(order)}`,
  );
}
