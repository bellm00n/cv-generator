import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfSection } from "./PdfSection";

const styles = StyleSheet.create({
  item: {
    marginTop: 4,
  },
});

export function ListSection({
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
          <Text key={`${itemKeyPrefix}-${index}`} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>
    </PdfSection>
  );
}
