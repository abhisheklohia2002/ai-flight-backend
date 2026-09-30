import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

import {
  calendarFareService,
} from "../../modules/flight/flight.dependencies.js";

import {
  generateDateRange,
} from "../../shared/utils/date-range.js";


export const calendarFareNode:
  GraphNode<
    typeof FlightAssistantState
  > =
  async (state) => {

    const search =
      state.calendarSearch;

    if (
      !search?.origin ||
      !search.destination ||
      !search.startDate ||
      !search.endDate
    ) {

      return {
        assistantMessage:
          "I need the route and travel dates to compare fares.",

        error:
          "Calendar fare parameters incomplete.",
      };
    }


    try {

      const dates =
        generateDateRange(
          search.startDate,
          search.endDate
        );


      const segments =
        dates.map(
          (
            departureDate
          ) => ({

            origin:
              search.origin!,

            destination:
              search.destination!,

            departureDate,

          })
        );


      console.log(
        "Calendar dates:",
        dates
      );


      const result =
        await calendarFareService
          .execute({

            tripType:
              "ONE_WAY",

            cabinClass:
              search.cabinClass,

            segments,
          });


      console.log(
        "Calendar fare results:",
        result.length
      );


      return {
        calendarResults:
          result,

        assistantMessage:
          "I found calendar fare information for the selected dates.",

        error:
          undefined,
      };


    } catch (error) {

      console.error(
        "Calendar fare error:",
        error
      );


      return {
        assistantMessage:
          "I could not retrieve calendar fares right now.",

        error:
          error instanceof Error
            ? error.message
            : "Calendar fare search failed.",
      };
    }
  };