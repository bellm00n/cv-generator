import { StyleSheet, Text } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 600,
  },
  sectionDescription: {
    color: "#98A1B2",
    fontSize: 9,
    lineHeight: 1
  },
});

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function SectionDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionDescription}>{children}</Text>;
}
