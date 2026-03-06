import { z } from "zod";
import type { CvDocument } from "@/types/cv";

type UnknownRecord = Record<string, unknown>;

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

const asRecord = (value: unknown): UnknownRecord | null =>
  typeof value === "object" && value !== null ? (value as UnknownRecord) : null;

const readString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const splitFullName = (
  fullName: string,
): Pick<CvFormValues, "name" | "surname"> => {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return { name: "", surname: "" };
  }

  const parts = normalized.split(" ");
  if (parts.length === 1) {
    return { name: parts[0], surname: "" };
  }

  return {
    name: parts.slice(0, -1).join(" "),
    surname: parts.at(-1) ?? "",
  };
};

const normalizeListItems = (value: unknown): CvFormValues["skills"] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { value: item };
      }

      const record = asRecord(item);
      if (record && typeof record.value === "string") {
        return { value: record.value };
      }

      return null;
    })
    .filter((item): item is CvFormValues["skills"][number] => item !== null);
};

const normalizeLinks = (value: unknown): CvFormValues["links"] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = asRecord(item);
      if (!record) {
        return null;
      }

      return {
        label: readString(record.label),
        url: readString(record.url),
      };
    })
    .filter((item): item is CvFormValues["links"][number] => item !== null);
};

const normalizeEmploymentHistory = (
  value: unknown,
): CvFormValues["employmentHistory"] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = asRecord(item);
      if (!record) {
        return null;
      }

      const description = (() => {
        const singleDescription = readString(record.description);
        if (singleDescription) {
          return singleDescription;
        }

        const normalizedBullets = normalizeListItems(record.bullets)
          .map((item) => item.value.trim())
          .filter(Boolean);

        return normalizedBullets.join("\n");
      })();

      const currentlyWorking =
        typeof record.currentlyWorking === "boolean"
          ? record.currentlyWorking
          : false;

      return {
        title: readString(record.title),
        company: readString(record.company ?? record.companyName),
        location: readString(record.location),
        startDate: readString(record.startDate),
        endDate: currentlyWorking ? "" : readString(record.endDate),
        currentlyWorking,
        description,
      };
    })
    .filter(
      (item): item is CvFormValues["employmentHistory"][number] =>
        item !== null,
    );
};

const normalizeEducation = (value: unknown): CvFormValues["education"] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = asRecord(item);
      if (!record) {
        return null;
      }

      return {
        degree: readString(record.degree),
        university: readString(record.university),
        startDate: readString(record.startDate),
        endDate: readString(record.endDate),
      };
    })
    .filter((item): item is CvFormValues["education"][number] => item !== null);
};

export function normalizePersistedCvForm(raw: unknown): CvFormValues | null {
  const source = asRecord(raw);
  if (!source) {
    return null;
  }

  const defaults = createDefaultCvFormValues();
  const contact = asRecord(source.contact);
  const fullNameFallback = splitFullName(readString(source.fullName));

  return {
    name: readString(source.name) || fullNameFallback.name,
    surname: readString(source.surname) || fullNameFallback.surname,
    title: readString(source.title),
    country: readString(source.country ?? contact?.country),
    city: readString(source.city ?? contact?.city),
    phone: readString(
      source.phone ?? source.number ?? contact?.phone ?? contact?.number,
    ),
    email: readString(source.email ?? contact?.email),
    summary: readString(source.summary),
    links:
      source.links === undefined
        ? defaults.links
        : normalizeLinks(source.links),
    skills:
      source.skills === undefined
        ? defaults.skills
        : normalizeListItems(source.skills),
    languages:
      source.languages === undefined
        ? defaults.languages
        : normalizeListItems(source.languages),
    employmentHistory:
      source.employmentHistory === undefined
        ? defaults.employmentHistory
        : normalizeEmploymentHistory(source.employmentHistory),
    education:
      source.education === undefined
        ? defaults.education
        : normalizeEducation(source.education),
  };
}

const hasContent = (value: string): boolean => value.trim().length > 0;

export function mapCvFormValuesToDocument(values: CvFormValues): CvDocument {
  const normalizedSkills = values.skills
    .map((item) => item.value.trim())
    .filter(Boolean);
  const normalizedLanguages = values.languages
    .map((item) => item.value.trim())
    .filter(Boolean);

  const normalizedLinks: CvDocument["links"] = values.links.flatMap(
    (item, index) => {
      const label = item.label.trim();
      const url = item.url.trim();

      if (!hasContent(label) && !hasContent(url)) {
        return [];
      }

      return [{ id: `link-${index + 1}`, label, url }];
    },
  );

  const normalizedEmploymentHistory: CvDocument["employmentHistory"] =
    values.employmentHistory.flatMap((item, index) => {
      const title = item.title.trim();
      const company = item.company.trim();
      const location = item.location.trim();
      const startDate = item.startDate.trim();
      const endDate = item.currentlyWorking ? "" : item.endDate.trim();
      const description = item.description.trim();

      if (
        !hasContent(title) &&
        !hasContent(company) &&
        !hasContent(location) &&
        !hasContent(startDate) &&
        !hasContent(endDate) &&
        !hasContent(description)
      ) {
        return [];
      }

      const entry: CvDocument["employmentHistory"][number] = {
        id: `employment-${index + 1}`,
        title,
        company,
        location,
        startDate,
        description,
      };

      if (endDate) {
        entry.endDate = endDate;
      }

      return [entry];
    });

  const normalizedEducation = values.education
    .map((item, index) => {
      const degree = item.degree.trim();
      const university = item.university.trim();
      const startDate = item.startDate.trim();
      const endDate = item.endDate.trim();

      if (
        !hasContent(degree) &&
        !hasContent(university) &&
        !hasContent(startDate) &&
        !hasContent(endDate)
      ) {
        return null;
      }

      return {
        id: `education-${index + 1}`,
        degree,
        university,
        startDate,
        endDate,
      };
    })
    .filter((item): item is CvDocument["education"][number] => item !== null);

  return {
    fullName: `${values.name.trim()} ${values.surname.trim()}`.trim(),
    title: values.title.trim(),
    contact: {
      country: values.country.trim(),
      city: values.city.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    },
    summary: values.summary.trim(),
    links: normalizedLinks,
    skills: normalizedSkills,
    languages: normalizedLanguages,
    employmentHistory: normalizedEmploymentHistory,
    education: normalizedEducation,
  };
}
