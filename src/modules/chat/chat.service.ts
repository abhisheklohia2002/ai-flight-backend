import {
  flightGraph,
} from "../../ai/graph/flight.graph.js";

import type {
  ChatRequest,
  ChatResponse,
} from "./chat.types.js";


export class ChatService {

  async sendMessage(
    request:
      ChatRequest
  ): Promise<ChatResponse> {

    const {
      sessionId,
      message,
      action,
      origin,
      flightId,
      passengerDetails,
      ssrSelections,
    } = request;


    const result =
      await flightGraph.invoke(
        {
          sessionId,
          ...(message !== undefined
            ? { lastUserMessage: message }
            : {}),
          ...(action ? { requestedAction: action } : {}),
          ...(action === "SET_ORIGIN" && origin
            ? { originToSync: origin }
            : {}),
          /**
           * Do not write undefined to checkpointed booking fields. A
           * passenger submission must retain the selected flight selected
           * during START_BOOKING on this same LangGraph thread.
           */
          ...(action === "START_BOOKING" && flightId
            ? { selectedFlightId: flightId }
            : {}),
          ...(action === "SUBMIT_PASSENGER_DETAILS" && passengerDetails
            ? { requestedPassengerDetails: passengerDetails }
            : {}),
          ...(action === "PREPARE_BOOKING" && ssrSelections
            ? { ssrSelections }
            : {}),
        },
        {
          configurable: {
            thread_id:
              sessionId,
          },
        }
      );


    /**
     * Origin synchronization
     */
    if (
      action ===
      "SET_ORIGIN"
    ) {

      return {
        sessionId,

        type:
          "MESSAGE",

        message:
          "",

        data: {
          search:
            result.search,
        },
      };
    }


    /**
     * Provider / infrastructure errors
     */
    if (
      result.error
    ) {

      return {
        sessionId,

        type:
          "ERROR",

        message:
          result.assistantMessage ??
          "Something went wrong while processing your request.",
      };
    }


    /**
     * PASSENGER DETAILS COMPLETE
     *
     * IMPORTANT:
     * Keep this before FARE_QUOTE
     * and FLIGHT_RESULTS because the old
     * fare quote and flight results still
     * exist in LangGraph memory.
     */
    if (
      result.bookingStep ===
      "PASSENGER_DETAILS_COMPLETE"
    ) {

      return {
        sessionId,

        type:
          "PASSENGER_DETAILS_COMPLETE",

        message:
          result.assistantMessage ??
          "Passenger details have been saved.",

        data: {
          bookingStep:
            result.bookingStep,
          ssrOptions: result.ssrOptions,
        },
      };
    }
    if (result.bookingStep === "BOOKING_PREPARED" && result.bookingPrepare) return { sessionId, type: "BOOKING_PREPARED", message: result.assistantMessage ?? "Your booking is ready for review.", data: { bookingPrepare: result.bookingPrepare, bookingStep: result.bookingStep } };


    /**
     * BOOKING — FARE QUOTE
     *
     * Keep this before FLIGHT_RESULTS.
     *
     * searchResults still exist in
     * LangGraph memory.
     */
    if (
      result.bookingStep ===
        "QUOTE_REVIEW" &&
      result.fareQuote
    ) {

      return {
        sessionId,

        type:
          "FARE_QUOTE",

        message:
          result.assistantMessage ??
          "Please review your updated fare.",

        data: {
          fareQuote:
            result.fareQuote,

          selectedFlightId:
            result.selectedFlightId,
        },
      };
    }


    /**
     * Airport selection
     */
    if (
      result.pendingAirportSelection &&
      result.airportCandidates &&
      result.airportCandidates.length >
        0
    ) {

      return {
        sessionId,

        type:
          "AIRPORT_SELECTION",

        message:
          "I found multiple airport options. Which airport would you like to use?",

        data: {
          airportSelectionFor:
            result.pendingAirportSelection,

          airports:
            result.airportCandidates,
        },
      };
    }


    /**
     * Missing / invalid information
     */
    if (
      (result.missingFields?.length ??
        0) > 0 ||
      (result.resolutionErrors?.length ??
        0) > 0 ||
      (result.validationErrors?.length ??
        0) > 0
    ) {

      return {
        sessionId,

        type:
          "ASK_MISSING_INFO",

        message:
          result.assistantMessage ??
          "I need some more information.",
      };
    }


    /**
     * Calendar results
     */
    if (
      result.calendarResults &&
      result.calendarResults.length >
        0
    ) {

      return {
        sessionId,

        type:
          "CALENDAR_RESULTS",

        message:
          result.assistantMessage ??
          "I found fare information for these dates.",

        data: {
          calendarFares:
            result.calendarResults,
        },
      };
    }


    /**
     * Flight results
     */
    if (
      result.searchResults &&
      result.searchResults.length >
        0
    ) {

      return {
        sessionId,

        type:
          "FLIGHT_RESULTS",

        message:
          result.assistantMessage ??
          `I found ${result.searchResults.length} flights.`,

        data: {
          flights:
            result.searchResults,

          search:
            result.search,

          traceId:
            result.traceId,

          expiryAt:
            result.searchExpiryAt,
        },
      };
    }


    /**
     * Default assistant response
     */
    return {
      sessionId,

      type:
        "MESSAGE",

      message:
        result.assistantMessage ??
        "How can I help you with your flight search?",
    };
  }
}


export const chatService =
  new ChatService();
