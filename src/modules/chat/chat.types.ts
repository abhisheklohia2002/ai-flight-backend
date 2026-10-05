import type {
  FlightOption,
} from "../flight/domain/flight-search.js";

import type {
  CalendarFareResult,
} from "../flight/domain/calendar-fare.js";

import type { Airport } from "../flight/domain/airport.js";


export interface ChatRequest {
  sessionId: string;
  message: string;
  action?: "MESSAGE" | "SET_ORIGIN";
  origin?: string;
}


export type ChatResponseType =
  | "MESSAGE"
  | "ASK_MISSING_INFO"
  | "FLIGHT_RESULTS"
  | "CALENDAR_RESULTS"
  | "AIRPORT_SELECTION"
  | "ERROR";


export interface ChatResponse {
  sessionId: string;

  type:
    ChatResponseType;

  message: string;

  data?: {
    flights?: FlightOption[];

    calendarFares?:
      CalendarFareResult[];

    airports?: Airport[];

    airportSelectionFor?: "ORIGIN" | "DESTINATION";

    search?: {
      origin?: string;

      destination?: string;

      departureDate?: string;

      returnDate?: string;

      adults?: number;

      children?: number;

      infants?: number;

      cabinClass?: string;

      preferredAirline?: string;

      nonStopOnly?: boolean;

      maxPrice?: number;
    };

    traceId?: string;

    expiryAt?: string;
  };
}
