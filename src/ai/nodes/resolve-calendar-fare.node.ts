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


export const resolveCalendarFareNode:
  GraphNode<
    typeof FlightAssistantState
  > =
  async (state) => {

    const extracted =
      state.calendarExtraction;

    if (!extracted) {
      return {};
    }

    const errors:
      string[] = [];

    let origin:
      string | undefined;

    let destination:
      string | undefined;

    let startDate:
      string | undefined;

    let endDate:
      string | undefined;


    /*
     * Origin
     */
    if (
      extracted.originText
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

        origin =
          airport.code;
      }
    }


    /*
     * Destination
     */
    if (
      extracted.destinationText
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

        destination =
          airport.code;
      }
    }


    /*
     * Start date
     */
    if (
      extracted.startDateText
    ) {

      const result =
        resolveTravelDate(
          extracted.startDateText,
          env.APP_TIMEZONE
        );

      if (
        result.error ||
        !result.date
      ) {

        errors.push(
          result.error ??
          "Unable to resolve start date."
        );

      } else {

        startDate =
          result.date;
      }
    }


    /*
     * End date
     */
    if (
      extracted.endDateText
    ) {

      const result =
        resolveTravelDate(
          extracted.endDateText,
          env.APP_TIMEZONE
        );

      if (
        result.error ||
        !result.date
      ) {

        errors.push(
          result.error ??
          "Unable to resolve end date."
        );

      } else {

        endDate =
          result.date;
      }
    }


    const calendarSearch = {
      origin,
      destination,
      startDate,
      endDate,

      cabinClass:
        extracted.cabinClass ??
        "ECONOMY",
    };


    console.log(
      "Resolved calendar search:",
      calendarSearch
    );


    return {
      calendarSearch,

      resolutionErrors:
        errors,
    };
  };