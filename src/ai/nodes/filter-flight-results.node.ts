import type {
  GraphNode,
} from "@langchain/langgraph";

import type {
  FlightOption,
} from "../../modules/flight/domain/flight-search.js";

import {
  FlightAssistantState,
} from "../graph/state.js";


function getDepartureHour(
  value: string
): number | null {

  /*
   * Handles ISO datetime.
   */
  const date =
    new Date(value);

  if (
    !Number.isNaN(
      date.getTime()
    )
  ) {
    return date.getHours();
  }


  /*
   * Handles strings containing HH:mm
   */
  const match =
    value.match(
      /(?:T|\s|^)(\d{1,2}):(\d{2})/
    );

  if (!match?.[1]) {
    return null;
  }

  const hour =
    Number(match[1]);

  return Number.isNaN(hour)
    ? null
    : hour;
}


function matchesTimePreference(
  flight: FlightOption,
  preference:
    | "MORNING"
    | "AFTERNOON"
    | "EVENING"
    | "NIGHT"
): boolean {

  const hour =
    getDepartureHour(
      flight.departureTime
    );

  if (hour === null) {
    return true;
  }

  switch (preference) {

    case "MORNING":
      return (
        hour >= 5 &&
        hour < 12
      );

    case "AFTERNOON":
      return (
        hour >= 12 &&
        hour < 17
      );

    case "EVENING":
      return (
        hour >= 17 &&
        hour < 21
      );

    case "NIGHT":
      return (
        hour >= 21 ||
        hour < 5
      );
  }
}


export const filterFlightResultsNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    const search =
      state.search;

    if (!search) {
      return {};
    }

    let flights =
      [
        ...state.allSearchResults,
      ];


    /*
     * Airline filter
     */
    if (
      search.preferredAirline
    ) {

      const preferred =
        search.preferredAirline
          .trim()
          .toLowerCase();

      flights =
        flights.filter(
          (flight) => {

            const airlineName =
              flight.airline.name
                .toLowerCase();

            const airlineCode =
              flight.airline.code
                .toLowerCase();

            return (
              airlineName.includes(
                preferred
              ) ||
              airlineCode ===
                preferred
            );
          }
        );
    }


    /*
     * Non-stop filter
     */
    if (
      search.nonStopOnly
    ) {

      flights =
        flights.filter(
          (flight) =>
            flight.stops === 0
        );
    }


    /*
     * Maximum price
     */
    if (
      search.maxPrice !==
      undefined
    ) {

      flights =
        flights.filter(
          (flight) =>
            flight.price.amount <=
            search.maxPrice!
        );
    }


    /*
     * Departure-time filter
     */
    if (
      search.departureTimePreference
    ) {

      flights =
        flights.filter(
          (flight) =>
            matchesTimePreference(
              flight,
              search.departureTimePreference!
            )
        );
    }


    console.log(
      `Filtered flights: ${flights.length}/${state.allSearchResults.length}`
    );


    return {
      searchResults:
        flights,

      assistantMessage:
        flights.length > 0
          ? `I found ${flights.length} matching flights.`
          : "I couldn't find any flights matching those filters.",
    };
  };