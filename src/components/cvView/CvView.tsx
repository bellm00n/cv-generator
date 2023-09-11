import React from "react";
import { CvFormData } from "@/types/cvFormData";

export const CvView = ({ cvData }: { cvData: CvFormData }) => {
  return <pre>{JSON.stringify(cvData, null, 2)}</pre>;
};
