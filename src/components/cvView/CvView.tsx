import React from "react";
import { CvFormData } from "@/types/cvFormData";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Box, Button, Divider } from "@mui/material";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const CvDocument = ({ cvData }: { cvData: CvFormData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {Object.entries(cvData).map(([key, value]) => (
            <Text key={key}>
              {key}: {value} <br />
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const CvView = ({ cvData }: { cvData: CvFormData }) => {
  return (
    <Box>
      <CvDocument cvData={cvData} />
      <Divider />
      <br />
      <PDFDownloadLink
        document={<CvDocument cvData={cvData} />}
        fileName="cv.pdf"
      >
        Download cv
      </PDFDownloadLink>
    </Box>
  );
};
