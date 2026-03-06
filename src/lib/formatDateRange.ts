const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatMonthYear(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value;

  const year = match[1];
  const monthIndex = Number.parseInt(match[2], 10) - 1;
  const monthName = MONTH_NAMES[monthIndex];

  return monthName ? `${monthName} ${year}` : value;
}

export const formatDateRange = (
  startDate: string,
  endDate: string,
  emptyEndLabel = "",
) => {
  const start = startDate.trim();
  const end = endDate.trim() || emptyEndLabel;

  const formattedStart = formatMonthYear(start);
  const formattedEnd = formatMonthYear(end);

  if (!start && !end) {
    return "";
  }

  if (!start) {
    return formattedEnd;
  }

  if (!end) {
    return formattedStart;
  }

  return `${formattedStart} \u2014 ${formattedEnd}`;
};
