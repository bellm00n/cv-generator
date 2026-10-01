import { describe, expect, it } from "vitest";
import { fc, it as fcIt } from "@fast-check/vitest";
import { formatDateRange } from "./formatDateRange";

describe("formatDateRange", () => {
  it("formats a start and end month", () => {
    expect(formatDateRange("2024-01", "2025-12")).toBe(
      "January 2024 — December 2025",
    );
  });

  fcIt.prop([fc.string(), fc.string(), fc.string()])(
    "never throws and always returns a string",
    (start, end, emptyEndLabel) => {
      expect(typeof formatDateRange(start, end, emptyEndLabel)).toBe("string");
    },
  );
});
