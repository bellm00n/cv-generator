import { z } from "zod";
import {
  createEmptyListItem,
  createEmptyEmploymentItem,
  createEmptyEducationItem,
  type CvFormValues,
} from "./formSchema";

type UnknownRecord = Record<string, unknown>;

const filterNonNull = <T>(items: (T | null)[]): T[] =>
  items.filter((item): item is T => item !== null);

const asRecord = (value: unknown): UnknownRecord | null =>
  typeof value === "object" && value !== null ? (value as UnknownRecord) : null;

const splitFullName = (
  fullName: string,
): Pick<CvFormValues, "name" | "surname"> => {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  if (!normalized) return { name: "", surname: "" };
  const parts = normalized.split(" ");
  if (parts.length === 1) return { name: parts[0], surname: "" };
  return { name: parts.slice(0, -1).join(" "), surname: parts.at(-1) ?? "" };
};

const importListItemSchema = z
  .union([
    z.string().transform((v) => ({ value: v })),
    z.object({ value: z.string() }),
  ])
  .nullable()
  .catch(null);

const importLinkItemSchema = z
  .object({
    label: z.string().catch(""),
    url: z.string().catch(""),
  })
  .nullable()
  .catch(null);

const importEmploymentItemSchema = z
  .union([
    z.preprocess(
      (item) => {
        const r = asRecord(item);
        if (!r) return item;

        const company = r.company ?? r.companyName ?? "";

        let description =
          typeof r.description === "string" ? r.description : "";
        if (!description && Array.isArray(r.bullets)) {
          description = r.bullets
            .map((b) => {
              if (typeof b === "string") return b.trim();
              const br = asRecord(b);
              return typeof br?.value === "string" ? br.value.trim() : "";
            })
            .filter(Boolean)
            .join("\n");
        }

        return { ...r, company, description };
      },
      z
        .object({
          title: z.string().catch(""),
          company: z.string().catch(""),
          location: z.string().catch(""),
          startDate: z.string().catch(""),
          endDate: z.string().catch(""),
          currentlyWorking: z.boolean().catch(false),
          description: z.string().catch(""),
        })
        .transform((item) => ({
          ...item,
          endDate: item.currentlyWorking ? "" : item.endDate,
        })),
    ),
    z.null(),
  ])
  .catch(null);

const importEducationItemSchema = z
  .object({
    degree: z.string().catch(""),
    university: z.string().catch(""),
    startDate: z.string().catch(""),
    endDate: z.string().catch(""),
  })
  .nullable()
  .catch(null);

export const cvImportSchema = z.preprocess(
  (raw) => {
    const r = asRecord(raw);
    if (!r) return raw;

    const contact = asRecord(r.contact) ?? {};
    const fullNameFallback = splitFullName(
      typeof r.fullName === "string" ? r.fullName : "",
    );

    return {
      name: r.name ?? fullNameFallback.name,
      surname: r.surname ?? fullNameFallback.surname,
      title: r.title,
      country: r.country ?? contact.country,
      city: r.city ?? contact.city,
      phone: r.phone ?? r.number ?? contact.phone ?? contact.number,
      email: r.email ?? contact.email,
      summary: r.summary,
      links: r.links,
      skills: r.skills,
      languages: r.languages,
      employmentHistory: r.employmentHistory,
      education: r.education,
    };
  },
  z.object({
    name: z.string().catch(""),
    surname: z.string().catch(""),
    title: z.string().catch(""),
    country: z.string().catch(""),
    city: z.string().catch(""),
    phone: z.string().catch(""),
    email: z.string().catch(""),
    summary: z.string().catch(""),
    links: z
      .array(importLinkItemSchema)
      .transform(filterNonNull)
      .catch([])
      .default([]),
    skills: z
      .array(importListItemSchema)
      .transform(filterNonNull)
      .catch([])
      .default([createEmptyListItem()]),
    languages: z
      .array(importListItemSchema)
      .transform(filterNonNull)
      .catch([])
      .default([createEmptyListItem()]),
    employmentHistory: z
      .array(importEmploymentItemSchema)
      .transform(filterNonNull)
      .catch([])
      .default([createEmptyEmploymentItem()]),
    education: z
      .array(importEducationItemSchema)
      .transform(filterNonNull)
      .catch([])
      .default([createEmptyEducationItem()]),
  }),
);

export function parseImportedCv(raw: unknown): CvFormValues | null {
  const result = cvImportSchema.safeParse(raw);
  return result.success ? result.data : null;
}
