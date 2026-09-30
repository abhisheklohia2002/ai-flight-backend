import { z } from "zod";

export const FlightSearchExtractionSchema = z.object({
  originText: z
    .string()
    .nullable(),

  destinationText: z
    .string()
    .nullable(),

  departureDateText: z
    .string()
    .nullable(),

  returnDateText: z
    .string()
    .nullable(),

  tripType: z
    .enum([
      "ONE_WAY",
      "ROUND_TRIP",
    ])
    .nullable(),

  adults: z
    .number()
    .int()
    .min(1)
    .nullable(),

  children: z
    .number()
    .int()
    .min(0)
    .nullable(),

  infants: z
    .number()
    .int()
    .min(0)
    .nullable(),

  cabinClass: z
    .enum([
      "ECONOMY",
      "PREMIUM_ECONOMY",
      "BUSINESS",
      "FIRST",
    ])
    .nullable(),

  preferredAirline: z
    .string()
    .nullable(),

  nonStopOnly: z
    .boolean()
    .nullable(),

  departureTimePreference: z
    .enum([
      "MORNING",
      "AFTERNOON",
      "EVENING",
      "NIGHT",
    ])
    .nullable(),

  maxPrice: z
    .number()
    .positive()
    .nullable(),
});

export type FlightSearchExtraction =
  z.infer<typeof FlightSearchExtractionSchema>;