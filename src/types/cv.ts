export interface CvContactInfo {
  country: string;
  city: string;
  phone: string;
  email: string;
}

export interface CvEmploymentEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface CvEducationEntry {
  id: string;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
}

export interface CvLinkEntry {
  id: string;
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
