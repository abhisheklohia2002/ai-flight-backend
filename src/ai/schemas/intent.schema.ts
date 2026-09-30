import { z } from "zod";

export const FlightIntentSchema = z.object({
  intent: z.enum([
    "SEARCH_FLIGHT",
    "CALENDAR_SEARCH",
    "MODIFY_SEARCH",
    "SELECT_FLIGHT",
    "FLIGHT_DETAILS",
    "START_BOOKING",
    "CANCEL",
    "UNKNOWN",
  ]),

  confidence: z
    .number()
    .min(0)
    .max(1),
});

export type FlightIntentResult =
  z.infer<typeof FlightIntentSchema>;