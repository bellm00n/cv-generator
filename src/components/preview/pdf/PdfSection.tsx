import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
});

export function PdfSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}
