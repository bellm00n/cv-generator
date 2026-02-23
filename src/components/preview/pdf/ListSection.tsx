import { Link, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

export const ListSectionText = ({ children }: { children: ReactNode }) => (
  <Text style={{ marginTop: 4 }}>{children}</Text>
);

export const ListSectionLink = ({
  src,
  children,
}: {
  src: string;
  children: ReactNode;
}) => (
  <Link
    src={src}
    style={{
      marginTop: 4,
      color: "#2079C7",
      textDecoration: "none",
    }}
  >
    {children}
  </Link>
);

export const ListSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={{ marginTop: 16 }}>
    <Text style={{ fontSize: 12, fontWeight: 600 }}>{title}</Text>
    <View>{children}</View>
  </View>
);
