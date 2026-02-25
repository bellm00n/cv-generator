import { StyleSheet, View } from "@react-pdf/renderer";
import { formatDateRange } from "@/lib/formatDateRange";
import type { CvDocument } from "@/types/cv";
import { PdfSection } from "./PdfSection";
import { SectionTitle, SectionDescription } from "./PdfTypography";
import { GraduationCapIcon } from "./SectionIcons";

const styles = StyleSheet.create({
  block: {
    marginTop: 8,
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
            <SectionTitle>
              {entry.degree || " "}
              {entry.university ? ` - ${entry.university}` : ""}
            </SectionTitle>
            <SectionDescription>
              {formatDateRange(entry.startDate, entry.endDate)}
            </SectionDescription>
          </View>
        ))}
      </View>
    </PdfSection>
  );
}
