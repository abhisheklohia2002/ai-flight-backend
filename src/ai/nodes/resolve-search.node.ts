// src/ai/nodes/resolve-search.node.ts

import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

import {
  resolveAirportSearch,
} from "../../modules/flight/application/search-airport.service.js";

import type {
  Airport,
} from "../../modules/flight/domain/airport.js";

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

      nonStopOnly: false,

      ...state.search,
    };

    const errors:
      string[] = [];

    let pendingAirportSelection: "ORIGIN" | "DESTINATION" | null = null;
    let airportCandidates: Airport[] = [];

    if (extracted.originText !== null) {
      const resolution = await resolveAirportSearch(extracted.originText);
      if (resolution.kind === "RESOLVED") {
        search.origin = resolution.airport.code;
      } else if (resolution.kind === "AMBIGUOUS") {
        pendingAirportSelection = "ORIGIN";
        airportCandidates = resolution.airports;
      } else {
        errors.push(`I couldn't find an airport matching ${extracted.originText}. Please provide a city or airport.`);
      }
    }

    if (extracted.destinationText !== null) {
      const resolution = await resolveAirportSearch(extracted.destinationText);
      if (resolution.kind === "RESOLVED") {
        search.destination = resolution.airport.code;
      } else if (resolution.kind === "AMBIGUOUS" && pendingAirportSelection === null) {
        pendingAirportSelection = "DESTINATION";
        airportCandidates = resolution.airports;
      } else {
        errors.push(`I couldn't find an airport matching ${extracted.destinationText}. Please provide a city or airport.`);
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

    // Preserve deterministic defaults while accepting explicit zero values.
    search.adults = extracted.adults ?? search.adults;
    search.children = extracted.children ?? search.children;
    search.infants = extracted.infants ?? search.infants;
    search.cabinClass = extracted.cabinClass ?? search.cabinClass;

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
      pendingAirportSelection,
      airportCandidates,
    };
  };
