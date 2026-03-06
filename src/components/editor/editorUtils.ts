export const WARNING_INPUT_CLASS =
  "border-amber-300 focus-visible:ring-amber-300/40";

export const getWarningMessage = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const getArrayWarning = (error: unknown): string | undefined => {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return undefined;
  }

  return getWarningMessage((error as { message?: unknown }).message);
};
