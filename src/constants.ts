import type { CvDocument } from "@/types/cv";

export const EMPTY_CV_DOCUMENT: CvDocument = {
  fullName: "",
  title: "",
  contact: {
    city: "",
    phone: "",
    email: "",
    country: "",
  },
  summary: "",
  links: [],
  skills: [],
  languages: [],
  employmentHistory: [],
  education: [],
};
