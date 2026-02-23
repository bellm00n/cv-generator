import { Document, Font, Page, StyleSheet, View } from "@react-pdf/renderer";
import type { CvDocument } from "@/types/cv";
import { EducationSection } from "./EducationSection";
import { EmploymentHistorySection } from "./EmploymentHistorySection";
import { ListSection, ListSectionLink, ListSectionText } from "./ListSection";
import { PdfHeader } from "./PdfHeader";
import { SummarySection } from "./SummarySection";

const MAIN_COLUMN_START = 58;
const SIDEBAR_START = 413;
const SIDEBAR_WIDTH = 141.28;
const COLUMN_GAP = 16;
const MAIN_COLUMN_WIDTH = SIDEBAR_START - MAIN_COLUMN_START - COLUMN_GAP;

Font.register({
  family: "Source Sans Pro",
  fonts: [
    { src: "/fonts/SourceSansPro-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/SourceSansPro-SemiBold.ttf", fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    color: "#262B33",
    fontFamily: "Source Sans Pro",
    fontSize: 11,
    paddingTop: 30,
    paddingBottom: 15,
    lineHeight: 1.4,
  },
  layout: {
    marginLeft: MAIN_COLUMN_START,
    marginRight: 41,
  },
  columns: {
    flexDirection: "row",
  },
  mainColumn: {
    width: MAIN_COLUMN_WIDTH,
    marginRight: COLUMN_GAP,
  },
  sideColumn: {
    width: SIDEBAR_WIDTH,
    paddingTop: "4px",
  },
});

const normalizeList = (items: string[]) =>
  items.map((item) => item.trim()).filter(Boolean);

export function CvPdfDocument({ cvData }: { cvData: CvDocument }) {
  const skills = normalizeList(cvData.skills);
  const languages = normalizeList(cvData.languages);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.layout}>
          <PdfHeader fullName={cvData.fullName} title={cvData.title} />

          <View style={styles.columns}>
            <View style={styles.mainColumn}>
              <SummarySection summary={cvData.summary} />
              <EmploymentHistorySection
                employmentHistory={cvData.employmentHistory}
              />
              <EducationSection education={cvData.education} />
            </View>

            <View style={styles.sideColumn}>
              <ListSection title="Details">
                <ListSectionText>{cvData.contact.city}</ListSectionText>
                <ListSectionText>{cvData.contact.phone}</ListSectionText>
                <ListSectionLink src={`mailto:${cvData.contact.email}`}>
                  {cvData.contact.email}
                </ListSectionLink>
              </ListSection>
              {cvData.links.length > 0 && (
                <ListSection title="Links">
                  {cvData.links.map((link) => (
                    <ListSectionLink key={link.id} src={link.url}>
                      {link.label}
                    </ListSectionLink>
                  ))}
                </ListSection>
              )}
              <ListSection title="Skills">
                {skills.map((skill) => (
                  <ListSectionText key={skill}>{skill}</ListSectionText>
                ))}
              </ListSection>
              <ListSection title="Languages">
                {languages.map((language) => (
                  <ListSectionText key={language}>{language}</ListSectionText>
                ))}
              </ListSection>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
