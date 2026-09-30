import type { GraphNode } from "@langchain/langgraph";

import { FlightAssistantState } from "../graph/state.js";

import { searchFlightService } from "../../modules/flight/flight.dependencies.js";

export const searchFlightsNode: GraphNode<typeof FlightAssistantState> = async (
  state,
) => {
  const search = state.search;

  if (
    !search ||
    !search.origin ||
    !search.destination ||
    !search.departureDate
  ) {
    return {
      error: "Search parameters are incomplete.",

      assistantMessage: "Some flight search information is missing.",
    };
  }

  console.log("Calling TripXL search with:", search);

  try {
    const result = await searchFlightService.execute({
      tripType: search.tripType,

      origin: search.origin,

      destination: search.destination,

      departureDate: search.departureDate,

      returnDate: search.returnDate,

      cabinClass: search.cabinClass,

      adults: search.adults,

      children: search.children,

      infants: search.infants,
    });

    console.log("Flights found:", result.flights.length);

    return {
      traceId: result.traceId,

      searchExpiryAt: result.expiryAt,

      allSearchResults: result.flights,

      searchResults: result.flights,

      error: undefined,
    };
  } 
  
 catch (error) {
  if (error instanceof Error) {
    console.error(
      "TripXL search error:",
      {
        name: error.name,
        message: error.message,
        cause: error.cause,
      }
    );
  } else {
    console.error(
      "TripXL search error:",
      error
    );
  }

  throw error;
}
};
