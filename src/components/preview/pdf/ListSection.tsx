import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { PdfSection } from "./PdfSection";

export function ListSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <PdfSection title={title}>
      <View>{children}</View>
    </PdfSection>
  );
}

const textStyles = StyleSheet.create({
  root: {
    marginTop: 4,
  },
});

export function ListSectionText({ children }: { children: ReactNode }) {
  return <Text style={textStyles.root}>{children}</Text>;
}

const linkStyles = StyleSheet.create({
  root: {
    marginTop: 4,
    color: "#2079C7",
    textDecoration: "none",
  },
});

export function ListSectionLink({
  src,
  children,
}: {
  src: string;
  children: ReactNode;
}) {
  return (
    <Link src={src} style={linkStyles.root}>
      {children}
    </Link>
  );
}
