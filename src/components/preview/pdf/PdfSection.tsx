import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const ICON_OFFSET = 19;

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -ICON_OFFSET,
    gap: 7,
  },
  iconWrap: {
    marginTop: 4,
  },
  titleRowPlain: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
});

export function PdfSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={icon ? styles.titleRow : styles.titleRowPlain}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>{children}</View>
    </View>
  );
}
