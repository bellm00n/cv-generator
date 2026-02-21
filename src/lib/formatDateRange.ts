export const formatDateRange = (
  startDate: string,
  endDate: string,
  emptyEndLabel = "",
) => {
  const start = startDate.trim();
  const end = endDate.trim() || emptyEndLabel;

  if (!start && !end) {
    return "";
  }

  if (!start) {
    return end;
  }

  if (!end) {
    return start;
  }

  return `${start} - ${end}`;
};
