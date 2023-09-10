import React from "react";
import { Button, FormControl, Grid } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";

type CvFormData = {
  jobTitle: "";
};

export const EditCvForm = () => {
  const { control, handleSubmit } = useForm<CvFormData>({
    defaultValues: {
      jobTitle: "",
    },
  });

  const onSubmit: SubmitHandler<CvFormData> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextFieldElement
              control={control}
              name="jobTitle"
              label="Job title"
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ paddingTop: "20px" }}>
            <Button type="submit" variant="outlined">
              Outlined
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};
