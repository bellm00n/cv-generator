import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatDateRange } from "@/lib/formatDateRange";
import type { CvDocument } from "@/types/cv";
import { PdfSection } from "./PdfSection";
import { GraduationCapIcon } from "./SectionIcons";

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
});

export function EducationSection({
  education,
}: {
  education: CvDocument["education"];
}) {
  return (
    <PdfSection title="Education" icon={<GraduationCapIcon />}>
      <View>
        {education.map((entry) => (
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
    </PdfSection>
  );
}
