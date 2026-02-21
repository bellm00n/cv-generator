import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { CvDocument } from "@/types/cv";

const PAGE_SIZE = {
  width: 595.28,
  height: 841.89,
};

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

const normalizeList = (items: string[]) =>
  items.map((item) => item.trim()).filter(Boolean);

const formatDateRange = (
  startDate: string,
  endDate: string,
  emptyEndLabel = "",
) => {
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

const sectionStyles = StyleSheet.create({
  section: {
    marginTop: 36.8,
  },
  title: {
    color: "#262B33",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
  },
  body: {
    marginTop: 9,
  },
});

function PdfSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={sectionStyles.section}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    marginBottom: 36.8,
  },
  name: {
    fontSize: 23,
    fontWeight: 600,
    lineHeight: 1.1,
  },
  title: {
    marginTop: 4,
  },
});

function PdfHeader({ fullName, title }: { fullName: string; title: string }) {
  return (
    <View style={headerStyles.header}>
      <Text style={headerStyles.name}>{fullName || " "}</Text>
      <Text style={headerStyles.title}>{title || " "}</Text>
    </View>
  );
}

const summarySectionStyles = StyleSheet.create({
  paragraph: {
    fontSize: 10.6,
    lineHeight: 1.45,
  },
});

function SummarySection({ summary }: { summary: string }) {
  return (
    <PdfSection title="Summary">
      <Text style={summarySectionStyles.paragraph}>{summary || " "}</Text>
    </PdfSection>
  );
}

const employmentHistorySectionStyles = StyleSheet.create({
  block: {
    marginTop: 21.37,
  },
  entryTitle: {
    fontSize: 10.6,
    fontWeight: 600,
    lineHeight: 1.45,
  },
  entryMeta: {
    marginTop: 2,
    color: "#98A1B2",
    fontSize: 9,
  },
  entryDescription: {
    marginTop: 7,
  },
  entryDescriptionText: {
    fontSize: 10.6,
    lineHeight: 1.45,
  },
});

function EmploymentHistorySection({
  employmentHistory,
}: {
  employmentHistory: CvDocument["employmentHistory"];
}) {
  return (
    <PdfSection title="Employment History">
      <View>
        {employmentHistory.map((entry) => {
          const description = entry.description.trim();

          return (
            <View key={entry.id} style={employmentHistorySectionStyles.block}>
              <Text style={employmentHistorySectionStyles.entryTitle}>
                {entry.title || " "} {entry.company ? `- ${entry.company}` : ""}
              </Text>
              <Text style={employmentHistorySectionStyles.entryMeta}>
                {formatDateRange(
                  entry.startDate,
                  entry.endDate ?? "",
                  "Present",
                )}
              </Text>
              {description ? (
                <View style={employmentHistorySectionStyles.entryDescription}>
                  <Text
                    style={employmentHistorySectionStyles.entryDescriptionText}
                  >
                    {description}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </PdfSection>
  );
}

const educationSectionStyles = StyleSheet.create({
  block: {
    marginTop: 21.37,
  },
  entryTitle: {
    fontSize: 10.6,
    fontWeight: 600,
    lineHeight: 1.45,
  },
  entryMeta: {
    marginTop: 2,
    color: "#98A1B2",
    fontSize: 9,
  },
});

function EducationSection({
  education,
}: {
  education: CvDocument["education"];
}) {
  return (
    <PdfSection title="Education">
      <View>
        {education.map((entry) => (
          <View key={entry.id} style={educationSectionStyles.block}>
            <Text style={educationSectionStyles.entryTitle}>
              {entry.degree || " "}
              {entry.university ? ` - ${entry.university}` : ""}
            </Text>
            <Text style={educationSectionStyles.entryMeta}>
              {formatDateRange(entry.startDate, entry.endDate)}
            </Text>
          </View>
        ))}
      </View>
    </PdfSection>
  );
}

const detailsSectionStyles = StyleSheet.create({
  item: {
    marginTop: 4,
    fontSize: 10.6,
    lineHeight: 1.45,
  },
});

function DetailsSection({ contact }: { contact: CvDocument["contact"] }) {
  return (
    <PdfSection title="Details">
      <View>
        <Text style={detailsSectionStyles.item}>{contact.city}</Text>
        {/* TODO: Add country */}
        {/* <Text style={detailsSectionStyles.item}>{contact.country}</Text> */}
        <Text style={detailsSectionStyles.item}>{contact.phone}</Text>
        <Text style={detailsSectionStyles.item}>{contact.email}</Text>
      </View>
    </PdfSection>
  );
}

const listSectionStyles = StyleSheet.create({
  item: {
    marginTop: 4,
    fontSize: 10.6,
    lineHeight: 1.45,
  },
});

function ListSection({
  title,
  items,
  itemKeyPrefix,
}: {
  title: string;
  items: string[];
  itemKeyPrefix: string;
}) {
  return (
    <PdfSection title={title}>
      <View>
        {items.map((item, index) => (
          <Text
            key={`${itemKeyPrefix}-${index}`}
            style={listSectionStyles.item}
          >
            {item}
          </Text>
        ))}
      </View>
    </PdfSection>
  );
}

const documentStyles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    color: "#262B33",
    fontFamily: "Source Sans Pro",
    fontSize: 10.6,
    paddingTop: 30,
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
  },
});

export function CvPdfDocument({ cvData }: { cvData: CvDocument }) {
  const skills = normalizeList(cvData.skills);
  const languages = normalizeList(cvData.languages);

  return (
    <Document>
      <Page size="A4" style={documentStyles.page}>
        <View style={documentStyles.layout}>
          <PdfHeader fullName={cvData.fullName} title={cvData.title} />

          <View style={documentStyles.columns}>
            <View style={documentStyles.mainColumn}>
              <SummarySection summary={cvData.summary} />
              <EmploymentHistorySection
                employmentHistory={cvData.employmentHistory}
              />
              <EducationSection education={cvData.education} />
            </View>

            <View style={documentStyles.sideColumn}>
              <DetailsSection contact={cvData.contact} />
              <ListSection
                title="Skills"
                items={skills}
                itemKeyPrefix="skill"
              />
              <ListSection
                title="Languages"
                items={languages}
                itemKeyPrefix="language"
              />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
