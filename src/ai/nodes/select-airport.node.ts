import type { GraphNode } from "@langchain/langgraph";

import { FlightAssistantState } from "../graph/state.js";

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export const selectAirportNode: GraphNode<typeof FlightAssistantState> = async (state) => {
  const selectionFor = state.pendingAirportSelection;
  const input = state.lastUserMessage?.trim();

  if (!selectionFor || !input) {
    return {};
  }

  const query = normalize(input);
  const matches = state.airportCandidates.filter((airport) =>
    [airport.code, airport.city, airport.name].some((value) => normalize(value) === query)
  );
  const airport = matches.length === 1 ? matches[0] : undefined;

  if (!airport) {
    return {
      resolutionErrors: ["Please select one of the airport options shown by entering its airport code, city, or airport name."],
    };
  }

  return {
    search: {
      ...state.search,
      [selectionFor === "ORIGIN" ? "origin" : "destination"]: airport.code,
    },
    pendingAirportSelection: null,
    airportCandidates: [],
    resolutionErrors: [],
  };
};
