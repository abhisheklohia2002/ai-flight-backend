import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

export const searchReadyNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    console.log(
      "Search is ready:",
      state.search
    );

    return {
      assistantMessage:
        "Search parameters are complete. Ready to search flights.",
    };
  };