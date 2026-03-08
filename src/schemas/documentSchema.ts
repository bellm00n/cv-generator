import { z } from "zod";

const cvItemIdSchema = z.string().trim().min(1, "Invalid identifier.");
const cvItemOrderSchema = z.number().int().positive("Invalid order.");

const cvLinkIdSchema = cvItemIdSchema.brand<"CvLinkId">();
const cvEmploymentIdSchema = cvItemIdSchema.brand<"CvEmploymentId">();
const cvEducationIdSchema = cvItemIdSchema.brand<"CvEducationId">();

export type CvLinkId = z.infer<typeof cvLinkIdSchema>;
export type CvEmploymentId = z.infer<typeof cvEmploymentIdSchema>;
export type CvEducationId = z.infer<typeof cvEducationIdSchema>;

function createCvLinkId(order: number): CvLinkId {
  return cvLinkIdSchema.parse(`link-${cvItemOrderSchema.parse(order)}`);
}

function createCvEmploymentId(order: number): CvEmploymentId {
  return cvEmploymentIdSchema.parse(
    `employment-${cvItemOrderSchema.parse(order)}`,
  );
}

function createCvEducationId(order: number): CvEducationId {
  return cvEducationIdSchema.parse(
    `education-${cvItemOrderSchema.parse(order)}`,
  );
}

const trim = () => z.string().trim().default("");

export const cvDocumentSchema = z
  .object({
    name: trim(),
    surname: trim(),
    title: trim(),
    country: trim(),
    city: trim(),
    phone: trim(),
    email: trim(),
    summary: trim(),
    links: z.array(z.object({ label: trim(), url: trim() })).default([]),
    skills: z.array(z.object({ value: trim() })).default([]),
    languages: z.array(z.object({ value: trim() })).default([]),
    employmentHistory: z
      .array(
        z.object({
          title: trim(),
          company: trim(),
          location: trim(),
          startDate: trim(),
          endDate: trim(),
          currentlyWorking: z.boolean().default(false),
          description: trim(),
        }),
      )
      .default([]),
    education: z
      .array(
        z.object({
          degree: trim(),
          university: trim(),
          startDate: trim(),
          endDate: trim(),
        }),
      )
      .default([]),
  })
  .transform((values) => {
    const links = values.links.flatMap((item, index) =>
      !item.label && !item.url
        ? []
        : [{ id: createCvLinkId(index + 1), label: item.label, url: item.url }],
    );

    const employmentHistory = values.employmentHistory.flatMap(
      (item, index) => {
        const endDate = item.currentlyWorking ? "" : item.endDate;
        if (
          !item.title &&
          !item.company &&
          !item.location &&
          !item.startDate &&
          !endDate &&
          !item.description
        ) {
          return [];
        }
        return [
          {
            id: createCvEmploymentId(index + 1),
            title: item.title,
            company: item.company,
            location: item.location,
            startDate: item.startDate,
            description: item.description,
            ...(endDate ? { endDate } : {}),
          },
        ];
      },
    );

    const education = values.education.flatMap((item, index) =>
      !item.degree && !item.university && !item.startDate && !item.endDate
        ? []
        : [
            {
              id: createCvEducationId(index + 1),
              degree: item.degree,
              university: item.university,
              startDate: item.startDate,
              endDate: item.endDate,
            },
          ],
    );

    return {
      fullName: `${values.name} ${values.surname}`.trim(),
      title: values.title,
      contact: {
        country: values.country,
        city: values.city,
        phone: values.phone,
        email: values.email,
      },
      summary: values.summary,
      links,
      skills: values.skills.map((item) => item.value).filter(Boolean),
      languages: values.languages.map((item) => item.value).filter(Boolean),
      employmentHistory,
      education,
    };
  });
