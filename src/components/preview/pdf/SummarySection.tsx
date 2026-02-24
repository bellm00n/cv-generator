import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfSection } from "./PdfSection";
import { ProfileIcon } from "./SectionIcons";

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
});

export function SummarySection({ summary }: { summary: string }) {
  return (
    <PdfSection title="Profile" icon={<ProfileIcon />}>
      <View style={styles.container}>
        <Text>{summary || " "}</Text>
      </View>
    </PdfSection>
  );
}
