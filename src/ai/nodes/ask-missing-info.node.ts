import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

function getMissingFieldQuestion(
  field: string
): string {

  switch (field) {

    case "origin":
      return "Where would you like to fly from?";

    case "destination":
      return "Where would you like to fly to?";

    case "departureDate":
      return "What date would you like to travel?";

    case "returnDate":
      return "What date would you like to return?";

    case "adults":
      return "How many adults are travelling?";

    case "tripType":
      return "Is this a one-way or round-trip journey?";

    default:
      return "Could you provide the missing flight information?";
  }
}

export const askMissingInfoNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    /*
     * Resolution error has priority.
     */
    const resolutionError =
      state.resolutionErrors?.[0];

    if (resolutionError) {

      console.log(
        "Resolution error:",
        resolutionError
      );

      return {
        assistantMessage:
          resolutionError,
      };
    }

    /*
     * Business validation error.
     */
    const validationError =
      state.validationErrors?.[0];

    if (validationError) {

      console.log(
        "Validation error:",
        validationError
      );

      return {
        assistantMessage:
          validationError,
      };
    }

    /*
     * Missing field.
     */
    const firstMissingField =
      state.missingFields?.[0];

    if (firstMissingField) {

      const question =
        getMissingFieldQuestion(
          firstMissingField
        );

      console.log(
        "Question:",
        question
      );

      return {
        assistantMessage:
          question,
      };
    }

    return {
      assistantMessage:
        "I need some more information to search for flights.",
    };
  };