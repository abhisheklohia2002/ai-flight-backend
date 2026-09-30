import { z } from "zod";

export const CalendarFareExtractionSchema =
  z.object({
    originText:
      z.string().nullable(),

    destinationText:
      z.string().nullable(),

    startDateText:
      z.string().nullable(),

    endDateText:
      z.string().nullable(),

    cabinClass:
      z.enum([
        "ECONOMY",
        "PREMIUM_ECONOMY",
        "BUSINESS",
        "FIRST",
      ]).nullable(),
  });

export type CalendarFareExtraction =
  z.infer<
    typeof CalendarFareExtractionSchema
  >;