// src/ai/nodes/resolve-search.node.ts

import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

import {
  resolveAirport,
} from "../../modules/airport/airport.service.js";

import {
  resolveTravelDate,
} from "../../shared/utils/date-resolver.js";

import {
  env,
} from "../../config/env.js";

export const resolveSearchNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    const extracted =
      state.extractedSearch;

    if (!extracted) {
      return {};
    }

    const search = {
      tripType:
        "ONE_WAY" as const,

      adults: 1,

      children: 0,

      infants: 0,

      cabinClass:
        "ECONOMY" as const,

      nonStopOnly: false,

      ...state.search,
    };

    const errors:
      string[] = [];

    if (
      extracted.originText !== null
    ) {
      const airport =
        resolveAirport(
          extracted.originText
        );

      if (!airport) {
        errors.push(
          `Unable to resolve origin airport: ${extracted.originText}`
        );
      } else {
        search.origin =
          airport.code;
      }
    }

    if (
      extracted.destinationText !== null
    ) {
      const airport =
        resolveAirport(
          extracted.destinationText
        );

      if (!airport) {
        errors.push(
          `Unable to resolve destination airport: ${extracted.destinationText}`
        );
      } else {
        search.destination =
          airport.code;
      }
    }

    if (
      extracted.departureDateText !== null
    ) {
      const result =
        resolveTravelDate(
          extracted.departureDateText,
          env.APP_TIMEZONE
        );

      if (
        !result.date ||
        result.error
      ) {
        errors.push(
          result.error ??
          "Unable to resolve departure date"
        );
      } else {
        search.departureDate =
          result.date;
      }
    }

    if (
      extracted.returnDateText !== null
    ) {
      const result =
        resolveTravelDate(
          extracted.returnDateText,
          env.APP_TIMEZONE
        );

      if (
        !result.date ||
        result.error
      ) {
        errors.push(
          result.error ??
          "Unable to resolve return date"
        );
      } else {
        search.returnDate =
          result.date;
      }
    }

    if (
      extracted.tripType !== null
    ) {
      search.tripType =
        extracted.tripType;
    }

    if (
      extracted.adults !== null
    ) {
      search.adults =
        extracted.adults;
    }

    if (
      extracted.children !== null
    ) {
      search.children =
        extracted.children;
    }

    if (
      extracted.infants !== null
    ) {
      search.infants =
        extracted.infants;
    }

    if (
      extracted.cabinClass !== null
    ) {
      search.cabinClass =
        extracted.cabinClass;
    }

    if (
      extracted.preferredAirline !== null
    ) {
      search.preferredAirline =
        extracted.preferredAirline;
    }

    if (
      extracted.nonStopOnly !== null
    ) {
      search.nonStopOnly =
        extracted.nonStopOnly;
    }

    if (
      extracted.departureTimePreference !== null
    ) {
      search.departureTimePreference =
        extracted.departureTimePreference;
    }

    if (
      extracted.maxPrice !== null
    ) {
      search.maxPrice =
        extracted.maxPrice;
    }

    return {
      search,
      resolutionErrors:
        errors,
    };
  };