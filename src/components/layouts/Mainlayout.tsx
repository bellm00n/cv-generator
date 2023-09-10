import { Grid } from "@mui/material";
import React, { ReactNode } from "react";

type MainLayoutProps = {
  editCvForm: ReactNode;
  cvView: ReactNode;
};

export const MainLayout = ({ editCvForm, cvView }: MainLayoutProps) => (
  <Grid container spacing={3}>
    <Grid item xs={6}>
      {editCvForm}
    </Grid>
    <Grid item xs={6}>
      {cvView}
    </Grid>
  </Grid>
);
