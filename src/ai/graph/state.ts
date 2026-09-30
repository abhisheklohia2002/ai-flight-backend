import { StateSchema } from "@langchain/langgraph";

import { z } from "zod";

import { FlightSearchExtractionSchema } from "../schemas/flight-search-extraction.schema.js";
import { FlightOptionSchema } from "../schemas/flight-option.schema.js";
import { CalendarFareExtractionSchema } from "../schemas/calendar-fare-extraction.schema.js";
import { CalendarFareResultSchema } from "../schemas/calendar-fare-result.schema.js";

const SearchStateSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),

  departureDate: z.string().optional(),
  returnDate: z.string().optional(),

  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]).default("ONE_WAY"),

  adults: z.number().int().min(1).default(1),

  children: z.number().int().min(0).default(0),

  infants: z.number().int().min(0).default(0),

  cabinClass: z
    .enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"])
    .default("ECONOMY"),

  preferredAirline: z.string().optional(),

  nonStopOnly: z.boolean().default(false),

  departureTimePreference: z
    .enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT"])
    .optional(),

  maxPrice: z.number().positive().optional(),
});

export const FlightAssistantState = new StateSchema({
  sessionId: z.string(),

  lastUserMessage: z.string().optional(),

  intent: z
    .enum([
      "SEARCH_FLIGHT",
      "CALENDAR_SEARCH",
      "MODIFY_SEARCH",
      "SELECT_FLIGHT",
      "FLIGHT_DETAILS",
      "START_BOOKING",
      "CANCEL",
      "UNKNOWN",
    ])
    .optional(),

  extractedSearch: FlightSearchExtractionSchema.optional(),

  search: SearchStateSchema.optional(),

  missingFields: z.array(z.string()).default([]),
  searchResults: z.array(FlightOptionSchema).default([]),
  selectedFlightId: z.string().optional(),
  assistantMessage: z.string().optional(),
  resolutionErrors: z.array(z.string()).default([]),
  traceId: z.string().optional(),
  calendarExtraction: CalendarFareExtractionSchema.optional(),
  searchExpiryAt: z.string().optional(),

  error: z.string().optional(),
  validationErrors: z.array(z.string()).default([]),
  calendarSearch: z
    .object({
      origin: z.string().optional(),

      destination: z.string().optional(),

      startDate: z.string().optional(),

      endDate: z.string().optional(),

      cabinClass: z
        .enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"])
        .default("ECONOMY"),
    })
    .optional(),

  calendarResults: z.array(CalendarFareResultSchema).default([]),

  allSearchResults: z.array(FlightOptionSchema).default([]),
});
