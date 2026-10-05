import type { GraphNode } from "@langchain/langgraph";
import { FlightAssistantState } from "../graph/state.js";

/** Updates the active LangGraph thread without adding a conversational turn. */
export const syncOriginNode: GraphNode<typeof FlightAssistantState> = async (state) => {
  const origin = state.originToSync;
  if (!origin) return {};

  return {
    search: {
      tripType: "ONE_WAY",
      nonStopOnly: false,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: "ECONOMY",
      ...state.search,
      origin,
    },
    originToSync: undefined,
    missingFields: [],
    resolutionErrors: [],
    validationErrors: [],
    pendingAirportSelection: null,
    airportCandidates: [],
  };
};
