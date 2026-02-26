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
});

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
                  {description.split(/\n{2,}/).map((paragraph, i) => (
                    <Text key={i} style={i > 0 ? styles.paragraph : undefined}>
                      {paragraph || " "}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </PdfSection>
  );
}
