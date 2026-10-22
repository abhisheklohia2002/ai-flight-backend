import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

import {
  fareQuoteService,
} from "../../modules/flight/flight.dependencies.js";


export const startBookingNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    const flightId =
      state.selectedFlightId;


    if (!flightId) {

      return {
        requestedAction:
          undefined,

        error:
          "No flight was selected.",

        assistantMessage:
          "Please select a flight before starting the booking.",
      };
    }


    const flight =
      state.allSearchResults
        .find(
          (item) =>
            item.id ===
            flightId
        );


    if (!flight) {

      return {
        requestedAction:
          undefined,

        error:
          "Selected flight was not found in the current search results.",

        assistantMessage:
          "I couldn't find that flight in your current search. Please select a flight again.",
      };
    }


    if (!state.traceId) {

      return {
        requestedAction:
          undefined,

        error:
          "Search traceId is missing.",

        assistantMessage:
          "Your flight search session is no longer available. Please search again.",
      };
    }


    if (!flight.resultIndex) {

      return {
        requestedAction:
          undefined,

        error:
          "Selected flight resultIndex is missing.",

        assistantMessage:
          "This flight cannot currently be quoted. Please select another flight.",
      };
    }


    try {

      const quote =
        await fareQuoteService.execute({
          traceId:
            state.traceId,

          selections: [
            {
              itineraryId:
                flight.id,

              resultIndex:
                flight.resultIndex,
            },
          ],
        });


      let assistantMessage =
        "Your fare is confirmed. Please review the flight and fare details before continuing.";


      if (
        quote.quoteStatus
          .isPriceChanged
      ) {

        assistantMessage =
          "The fare has changed since your search. Please review the updated price before continuing.";

      } else if (
        quote.quoteStatus
          .isTimeChanged
      ) {

        assistantMessage =
          "The flight schedule has changed. Please review the updated timings before continuing.";
      }


      return {
        requestedAction:
          undefined,

        intent:
          "START_BOOKING",

        selectedFlightId:
          flight.id,

        selectedFlightResultIndex:
          flight.resultIndex,

        bookingTraceId:
          state.traceId,

        fareQuote:
          quote,

        bookingStep:
          "QUOTE_REVIEW",

        assistantMessage,

        error:
          undefined,
      };

    } catch (error) {

      console.error(
        "Fare quote failed:",
        error
      );


      return {
        requestedAction:
          undefined,

        error:
          error instanceof Error
            ? error.message
            : "Fare quote failed.",

        assistantMessage:
          "I couldn't confirm the latest fare for this flight. Please try again.",
      };
    }
  };


