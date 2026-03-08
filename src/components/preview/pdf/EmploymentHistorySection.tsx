import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatDateRange } from "@/lib/formatDateRange";
import type { CvDocument } from "@/types/cv";
import { PdfSection } from "./PdfSection";
import { SectionTitle, SectionDescription } from "./PdfTypography";
import { BriefcaseIcon } from "./SectionIcons";

const styles = StyleSheet.create({
  block: {
    marginTop: 8,
  },
  entryDescription: {
    marginTop: 4,
  },
  paragraph: {
    marginTop: 4,
  },
  bold: {
    fontWeight: 600,
  },
});

function renderFormattedText(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} style={styles.bold}>
        {part}
      </Text>
    ) : (
      part
    ),
  );
}

export function EmploymentHistorySection({
  employmentHistory,
}: {
  employmentHistory: CvDocument["employmentHistory"];
}) {
  return (
    <PdfSection title="Employment History" icon={<BriefcaseIcon />}>
      <View>
        {employmentHistory.map((entry) => {
          const description = entry.description.trim();

          return (
            <View key={entry.id} style={styles.block}>
              <SectionTitle>
                {entry.title || " "}
                {entry.company ? ` at ${entry.company}` : ""}
                {entry.location ? `, ${entry.location}` : ""}
              </SectionTitle>
              <SectionDescription>
                {formatDateRange(
                  entry.startDate,
                  entry.endDate ?? "",
                  "Present",
                )}
              </SectionDescription>
              {description ? (
                <View style={styles.entryDescription}>
                  <Text style={styles.paragraph}>
                    {renderFormattedText(description)}
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
