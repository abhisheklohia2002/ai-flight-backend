import type {
  FlightOption,
} from "../flight/domain/flight-search.js";

import type {
  CalendarFareResult,
} from "../flight/domain/calendar-fare.js";

import type {
  Airport,
} from "../flight/domain/airport.js";

import type {
  FareQuote,
} from "../../ai/schemas/fare-quote.schema.js";

import type {
  PassengerDetails,
} from "../flight/domain/passenger-details.js";
import type { SsrOptions } from "../../ai/schemas/ssr-options.schema.js";
import type { BookingPrepareResponse, SsrSelections } from "../../ai/schemas/booking-prepare.schema.js";


export type BookingStep =
  | "QUOTE_REVIEW"
  | "PASSENGER_DETAILS"
  | "PASSENGER_DETAILS_COMPLETE"
  | "BOOKING_PREPARED";


export interface ChatRequest {
  sessionId: string;

  message?: string;

  action?:
    | "MESSAGE"
    | "SET_ORIGIN"
    | "START_BOOKING"
    | "SUBMIT_PASSENGER_DETAILS"
    | "PREPARE_BOOKING";

  origin?: string;

  flightId?: string;

  passengerDetails?:
    PassengerDetails;
  ssrSelections?: SsrSelections;
}


export type ChatResponseType =
  | "MESSAGE"
  | "ASK_MISSING_INFO"
  | "FLIGHT_RESULTS"
  | "CALENDAR_RESULTS"
  | "AIRPORT_SELECTION"
  | "FARE_QUOTE"
  | "PASSENGER_DETAILS_COMPLETE"
  | "BOOKING_PREPARED"
  | "ERROR";


export interface ChatResponse {
  sessionId:
    string;

  type:
    ChatResponseType;

  message:
    string;

  data?: {
    flights?:
      FlightOption[];

    calendarFares?:
      CalendarFareResult[];

    airports?:
      Airport[];

    airportSelectionFor?:
      "ORIGIN"
      | "DESTINATION";

    fareQuote?:
      FareQuote;
    ssrOptions?: SsrOptions;
    bookingPrepare?: BookingPrepareResponse;

    selectedFlightId?:
      string;

    bookingStep?:
      BookingStep;

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

    traceId?:
      string;

    expiryAt?:
      string;
  };
}
