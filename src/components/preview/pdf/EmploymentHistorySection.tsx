import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatDateRange } from "@/lib/formatDateRange";
import type { CvDocument } from "@/types/cv";
import { PdfSection } from "./PdfSection";
import { BriefcaseIcon } from "./SectionIcons";

const styles = StyleSheet.create({
  block: {
    marginTop: 8,
  },
  entryTitle: {
    fontWeight: 600,
  },
  entryMeta: {
    marginTop: 2,
    color: "#98A1B2",
    fontSize: 9,
  },
  entryDescription: {
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
              <Text style={styles.entryTitle}>
                {entry.title || " "}{" "}
                {entry.company ? `at ${entry.company}` : ""}
              </Text>
              <Text style={styles.entryMeta}>
                {formatDateRange(
                  entry.startDate,
                  entry.endDate ?? "",
                  "Present",
                )}
              </Text>
              {description ? (
                <View style={styles.entryDescription}>
                  <Text>{description}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </PdfSection>
  );
}
