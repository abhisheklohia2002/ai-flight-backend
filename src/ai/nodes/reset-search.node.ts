import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

export const resetSearchNode:
  GraphNode<typeof FlightAssistantState> =
  async () => {

    console.log(
      "Starting new flight search"
    );

    return {
      search: {
        tripType:
          "ONE_WAY",

        adults:
          1,

        children:
          0,

        infants:
          0,

        cabinClass:
          "ECONOMY",

        nonStopOnly:
          false,
      },

      missingFields:
        [],

      resolutionErrors:
        [],

      validationErrors:
        [],

      allSearchResults:
        [],

      searchResults:
        [],

      traceId:
        undefined,

      searchExpiryAt:
        undefined,

      error:
        undefined,

      assistantMessage:
        undefined,
    };
  };