import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    marginBottom: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1,
  },
  title: {
    marginTop: 6,
    fontSize: 9,
  },
});

export function PdfHeader({
  fullName,
  title,
}: {
  fullName: string;
  title: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{fullName || " "}</Text>
      <Text style={styles.title}>{title || " "}</Text>
    </View>
  );
}
