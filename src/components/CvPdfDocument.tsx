import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { CvDocument } from "@/types/cv";

const PAGE_SIZE = {
  width: 595.28,
  height: 841.89
};

const MAIN_COLUMN_START = 58;
const SIDEBAR_START = 413;
const SIDEBAR_WIDTH = 141.28;
const COLUMN_GAP = 16;
const MAIN_COLUMN_WIDTH = SIDEBAR_START - MAIN_COLUMN_START - COLUMN_GAP;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    color: "#262B33",
    fontFamily: "Helvetica",
    fontSize: 10.6,
    paddingTop: 30,
    paddingBottom: 36
  },
  layout: {
    marginLeft: MAIN_COLUMN_START,
    marginRight: 41
  },
  header: {
    marginBottom: 36.8
  },
  name: {
    fontSize: 23,
    fontWeight: 600,
    lineHeight: 1.1
  },
  title: {
    marginTop: 4,
    color: "#98A1B2",
    fontSize: 10.6,
    fontWeight: 600
  },
  contactRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  metaText: {
    color: "#98A1B2",
    fontSize: 9
  },
  contactLink: {
    color: "#2196F3",
    fontSize: 9,
    textDecoration: "none"
  },
  columns: {
    flexDirection: "row"
  },
  mainColumn: {
    width: MAIN_COLUMN_WIDTH,
    marginRight: COLUMN_GAP
  },
  sideColumn: {
    width: SIDEBAR_WIDTH
  },
  section: {
    marginTop: 36.8
  },
  sectionTitle: {
    color: "#262B33",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4
  },
  sectionBody: {
    marginTop: 9
  },
  paragraph: {
    fontSize: 10.6,
    lineHeight: 1.45
  },
  block: {
    marginTop: 21.37
  },
  entryTitle: {
    fontSize: 10.6,
    fontWeight: 600,
    lineHeight: 1.45
  },
  entryMeta: {
    marginTop: 2,
    color: "#98A1B2",
    fontSize: 9
  },
  entryDescription: {
    marginTop: 7
  },
  entryDescriptionText: {
    fontSize: 10.6,
    lineHeight: 1.45
  },
  sideListItem: {
    marginTop: 4,
    fontSize: 10.6,
    lineHeight: 1.45
  }
});

const normalizeList = (items: string[]) =>
  items.map((item) => item.trim()).filter(Boolean);

const sectionData = (title: string, children: ReactNode) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const formatDateRange = (startDate: string, endDate: string, emptyEndLabel = "") => {
  const start = startDate.trim();
  const end = endDate.trim() || emptyEndLabel;

  if (!start && !end) {
    return "";
  }

  if (!start) {
    return end;
  }

  if (!end) {
    return start;
  }

  return `${start} - ${end}`;
};

export function CvPdfDocument({ cvData }: { cvData: CvDocument }) {
  const skills = normalizeList(cvData.skills);
  const languages = normalizeList(cvData.languages);

  return (
    <Document>
      <Page size={PAGE_SIZE} style={styles.page}>
        <View style={styles.layout}>
          <View style={styles.header}>
            <Text style={styles.name}>{cvData.fullName || " "}</Text>
            <Text style={styles.title}>{cvData.title || " "}</Text>
            <View style={styles.contactRow}>
              {cvData.contact.city ? (
                <Text style={styles.metaText}>{cvData.contact.city}</Text>
              ) : null}
              {cvData.contact.phone ? (
                <Text style={styles.metaText}>{cvData.contact.phone}</Text>
              ) : null}
              {cvData.contact.email ? (
                <Link style={styles.contactLink} src={`mailto:${cvData.contact.email}`}>
                  {cvData.contact.email}
                </Link>
              ) : null}
            </View>
          </View>

          <View style={styles.columns}>
            <View style={styles.mainColumn}>
              {sectionData(
                "SUMMARY",
                <Text style={styles.paragraph}>{cvData.summary || " "}</Text>
              )}

              {sectionData(
                "EMPLOYMENT HISTORY",
                <View>
                  {cvData.employmentHistory.map((entry) => {
                    const description = entry.description.trim();

                    return (
                      <View key={entry.id} style={styles.block}>
                        <Text style={styles.entryTitle}>
                          {entry.title || " "} {entry.company ? `- ${entry.company}` : ""}
                        </Text>
                        <Text style={styles.entryMeta}>
                          {formatDateRange(entry.startDate, entry.endDate ?? "", "Present")}
                        </Text>
                        {description ? (
                          <View style={styles.entryDescription}>
                            <Text style={styles.entryDescriptionText}>{description}</Text>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}

              {sectionData(
                "EDUCATION",
                <View>
                  {cvData.education.map((entry) => (
                    <View key={entry.id} style={styles.block}>
                      <Text style={styles.entryTitle}>
                        {entry.degree || " "}
                        {entry.university ? ` - ${entry.university}` : ""}
                      </Text>
                      <Text style={styles.entryMeta}>
                        {formatDateRange(entry.startDate, entry.endDate)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.sideColumn}>
              {sectionData(
                "SKILLS",
                <View>
                  {skills.map((skill, index) => (
                    <Text key={`skill-${index}`} style={styles.sideListItem}>
                      {skill}
                    </Text>
                  ))}
                </View>
              )}

              {sectionData(
                "LANGUAGES",
                <View>
                  {languages.map((language, index) => (
                    <Text key={`language-${index}`} style={styles.sideListItem}>
                      {language}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
