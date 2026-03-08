import type {
  CvEducationId,
  CvEmploymentId,
  CvLinkId,
} from "@/schemas/documentSchema";

export interface CvContactInfo {
  country: string;
  city: string;
  phone: string;
  email: string;
}

export interface CvEmploymentEntry {
  id: CvEmploymentId;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface CvEducationEntry {
  id: CvEducationId;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
}

export interface CvLinkEntry {
  id: CvLinkId;
  label: string;
  url: string;
}

export interface CvDocument {
  fullName: string;
  title: string;
  contact: CvContactInfo;
  summary: string;
  links: CvLinkEntry[];
  skills: string[];
  languages: string[];
  employmentHistory: CvEmploymentEntry[];
  education: CvEducationEntry[];
}
