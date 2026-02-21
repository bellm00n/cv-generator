import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfSection } from "./PdfSection";

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
});

export function SummarySection({ summary }: { summary: string }) {
  return (
    <PdfSection title="Profile">
      <View style={styles.container}>
        <Text>{summary || " "}</Text>
      </View>
    </PdfSection>
  );
}
