import type { CvFormValues } from "@/lib/schemas";
import type { CvDocument } from "@/types/cv";

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
