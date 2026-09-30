// src/shared/utils/date-resolver.ts

import {
  addDays,
  format,
} from "date-fns";

import {
  TZDate,
} from "@date-fns/tz";

export interface DateResolutionResult {
  date: string | null;
  error: string | null;
}

const months: Record<string, number> = {
  january: 0,
  jan: 0,

  february: 1,
  feb: 1,

  march: 2,
  mar: 2,

  april: 3,
  apr: 3,

  may: 4,

  june: 5,
  jun: 5,

  july: 6,
  jul: 6,

  august: 7,
  aug: 7,

  september: 8,
  sep: 8,
  sept: 8,

  october: 9,
  oct: 9,

  november: 10,
  nov: 10,

  december: 11,
  dec: 11,
};

const weekdays: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function normalize(
  input: string
): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function dateString(
  date: Date
): string {
  return format(
    date,
    "yyyy-MM-dd"
  );
}

function isPastDate(
  date: string,
  today: string
): boolean {
  return date < today;
}

function resolveWeekday(
  weekdayName: string,
  mode: "THIS" | "NEXT",
  today: TZDate
): TZDate | null {

  const targetDay =
    weekdays[weekdayName];

  // Important because noUncheckedIndexedAccess is enabled
  if (targetDay === undefined) {
    return null;
  }

  const currentDay =
    today.getDay();

  let difference =
    (targetDay - currentDay + 7) % 7;

  if (
    mode === "NEXT" &&
    difference === 0
  ) {
    difference = 7;
  }

  return addDays(
    today,
    difference
  ) as TZDate;
}

function resolveNamedDate(
  input: string,
  today: TZDate,
  timeZone: string
): TZDate | null {

  /*
   * Matches:
   *
   * 10 October
   * 10 October 2026
   */
  const dayFirstMatch =
    input.match(
      /^(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?$/
    );

  /*
   * Matches:
   *
   * October 10
   * October 10 2026
   */
  const monthFirstMatch =
    input.match(
      /^([a-z]+)\s+(\d{1,2})(?:\s+(\d{4}))?$/
    );

  let day: number;
  let monthName: string;
  let year: number | undefined;

  if (dayFirstMatch) {

    const dayValue =
      dayFirstMatch[1];

    const monthValue =
      dayFirstMatch[2];

    const yearValue =
      dayFirstMatch[3];

    /*
     * TypeScript wants us to verify
     * these exist.
     */
    if (
      dayValue === undefined ||
      monthValue === undefined
    ) {
      return null;
    }

    day =
      Number(dayValue);

    monthName =
      monthValue;

    year =
      yearValue !== undefined
        ? Number(yearValue)
        : undefined;

  } else if (monthFirstMatch) {

    const monthValue =
      monthFirstMatch[1];

    const dayValue =
      monthFirstMatch[2];

    const yearValue =
      monthFirstMatch[3];

    if (
      dayValue === undefined ||
      monthValue === undefined
    ) {
      return null;
    }

    day =
      Number(dayValue);

    monthName =
      monthValue;

    year =
      yearValue !== undefined
        ? Number(yearValue)
        : undefined;

  } else {

    return null;
  }

  const month =
    months[monthName];

  if (month === undefined) {
    return null;
  }

  if (
    Number.isNaN(day) ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const currentYear =
    today.getFullYear();

  let targetYear =
    year ?? currentYear;

  let result =
    new TZDate(
      targetYear,
      month,
      day,
      timeZone
    );

  if (
    Number.isNaN(
      result.getTime()
    )
  ) {
    return null;
  }

  /*
   * Example:
   *
   * Today = 30 Sep 2026
   * User says = "10 October"
   *
   * => 2026-10-10
   *
   *
   * Today = 20 Oct 2026
   * User says = "10 October"
   *
   * => 2027-10-10
   */
  if (year === undefined) {

    const formatted =
      dateString(result);

    const todayFormatted =
      dateString(today);

    if (
      formatted < todayFormatted
    ) {

      targetYear += 1;

      result =
        new TZDate(
          targetYear,
          month,
          day,
          timeZone
        );
    }
  }

  /*
   * Validate that the date actually exists.
   *
   * Example:
   *
   * 31 February
   *
   * should NOT silently become March.
   */
  if (
    result.getDate() !== day ||
    result.getMonth() !== month
  ) {
    return null;
  }

  return result;
}

export function resolveTravelDate(
  input: string,
  timeZone: string
): DateResolutionResult {

  const value =
    normalize(input);

  const today =
    TZDate.tz(
      timeZone
    );

  const todayString =
    dateString(today);

  let resolved:
    TZDate | null = null;

  /*
   * Already resolved YYYY-MM-DD
   */
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {

    if (
      isPastDate(
        value,
        todayString
      )
    ) {

      return {
        date: null,
        error:
          "Travel date cannot be in the past.",
      };
    }

    return {
      date: value,
      error: null,
    };
  }

  /*
   * TODAY
   */
  if (value === "today") {

    resolved =
      today;
  }

  /*
   * TOMORROW
   */
  else if (
    value === "tomorrow"
  ) {

    resolved =
      addDays(
        today,
        1
      ) as TZDate;
  }

  /*
   * DAY AFTER TOMORROW
   */
  else if (
    value ===
      "day after tomorrow" ||
    value ===
      "the day after tomorrow"
  ) {

    resolved =
      addDays(
        today,
        2
      ) as TZDate;
  }

  /*
   * this friday
   * next monday
   */
  if (!resolved) {

    const weekdayMatch =
      value.match(
        /^(this|next)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/
      );

    if (weekdayMatch) {

      const modeValue =
        weekdayMatch[1];

      const weekdayValue =
        weekdayMatch[2];

      if (
        modeValue !== undefined &&
        weekdayValue !== undefined
      ) {

        resolved =
          resolveWeekday(
            weekdayValue,

            modeValue === "next"
              ? "NEXT"
              : "THIS",

            today
          );
      }
    }
  }

  /*
   * 10 October
   * October 10
   * 10 October 2026
   * October 10 2026
   */
  if (!resolved) {

    resolved =
      resolveNamedDate(
        value,
        today,
        timeZone
      );
  }

  if (!resolved) {

    return {
      date: null,

      error:
        `Unable to resolve travel date: ${input}`,
    };
  }

  const resolvedString =
    dateString(resolved);

  if (
    isPastDate(
      resolvedString,
      todayString
    )
  ) {

    return {
      date: null,

      error:
        "Travel date cannot be in the past.",
    };
  }

  return {
    date:
      resolvedString,

    error:
      null,
  };
}