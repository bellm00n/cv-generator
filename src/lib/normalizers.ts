import {
  createDefaultCvFormValues,
  type CvFormValues,
} from "@/schemas/formSchema";

type UnknownRecord = Record<string, unknown>;

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
