import { z } from "zod";

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
