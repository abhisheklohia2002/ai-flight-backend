import {
  addDays,
  format,
  parseISO,
} from "date-fns";


export function generateDateRange(
  startDate: string,
  endDate: string
): string[] {

  const start =
    parseISO(startDate);

  const end =
    parseISO(endDate);

  if (
    Number.isNaN(
      start.getTime()
    ) ||
    Number.isNaN(
      end.getTime()
    )
  ) {
    throw new Error(
      "Invalid date range."
    );
  }

  if (end < start) {
    throw new Error(
      "End date cannot be before start date."
    );
  }

  const dates:
    string[] = [];

  let current =
    start;

  while (
    current <= end
  ) {

    dates.push(
      format(
        current,
        "yyyy-MM-dd"
      )
    );

    current =
      addDays(
        current,
        1
      );
  }

  return dates;
}