import type {
  FlightOption,
} from "../flight/domain/flight-search.js";

import type {
  CalendarFareResult,
} from "../flight/domain/calendar-fare.js";


export interface ChatRequest {
  sessionId: string;
  message: string;
}


export type ChatResponseType =
  | "MESSAGE"
  | "ASK_MISSING_INFO"
  | "FLIGHT_RESULTS"
  | "CALENDAR_RESULTS"
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