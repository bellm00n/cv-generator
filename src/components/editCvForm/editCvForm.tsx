import React, { useEffect } from "react";
import { Button, FormControl, Grid, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import { CvFormData } from "@/types/cvFormData";

type EditCvFormProps = {
  onSave: (data: CvFormData | undefined) => void;
};

export const CV_DATA_KEY = "cvData";

export const getInitialCvData = (): CvFormData | undefined => {
  const cvDataString = localStorage.getItem(CV_DATA_KEY);
  const parsedCvData = cvDataString ? JSON.parse(cvDataString) : undefined;

  return parsedCvData;
};

export const EditCvForm = ({ onSave }: EditCvFormProps) => {
  const { control, handleSubmit, reset } = useForm<CvFormData>();

  const onSubmit: SubmitHandler<CvFormData> = (newCvData) => {
    onSave(newCvData);
    localStorage.setItem(CV_DATA_KEY, JSON.stringify(newCvData));
  };

  useEffect(() => {
    const cvDataFromStorage = getInitialCvData();
    onSave(cvDataFromStorage);
    reset(cvDataFromStorage || {});
  }, [onSave, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Personal data
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="jobTitle"
              label="Job title"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="firstName"
              label="First Name"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="lastName"
              label="Last Name"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextFieldElement
              type={"email"}
              control={control}
              name="email"
              label="Email"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="phone"
              label="Phone"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="country"
              label="Country"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="city"
              label="City"
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Professional summary
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextFieldElement
              name={"summary"}
              label="Summary"
              control={control}
              multiline
              rows={6}
              variant="outlined"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl sx={{ paddingTop: "20px" }}>
            <Button type="submit" variant="outlined">
              Save
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};
