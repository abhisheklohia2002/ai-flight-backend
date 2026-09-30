import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

export const validateSearchNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    const search =
      state.search;

    const missingFields:
      string[] = [];

    const validationErrors:
      string[] = [];

    if (!search) {
      return {
        missingFields: [
          "origin",
          "destination",
          "departureDate",
        ],

        validationErrors: [],
      };
    }

    if (!search.origin) {
      missingFields.push(
        "origin"
      );
    }

    if (!search.destination) {
      missingFields.push(
        "destination"
      );
    }

    if (!search.departureDate) {
      missingFields.push(
        "departureDate"
      );
    }

    if (
      search.adults === undefined ||
      search.adults < 1
    ) {
      missingFields.push(
        "adults"
      );
    }

    if (!search.tripType) {
      missingFields.push(
        "tripType"
      );
    }

    if (
      search.tripType ===
        "ROUND_TRIP" &&
      !search.returnDate
    ) {
      missingFields.push(
        "returnDate"
      );
    }

    if (
      search.origin &&
      search.destination &&
      search.origin ===
        search.destination
    ) {
      validationErrors.push(
        "Origin and destination cannot be the same."
      );
    }

    if (
      search.tripType ===
        "ROUND_TRIP" &&
      search.departureDate &&
      search.returnDate &&
      search.returnDate <
        search.departureDate
    ) {
      validationErrors.push(
        "Return date cannot be before departure date."
      );
    }

    console.log(
      "Missing fields:",
      missingFields
    );

    console.log(
      "Validation errors:",
      validationErrors
    );

    return {
      missingFields,
      validationErrors,
    };
  };