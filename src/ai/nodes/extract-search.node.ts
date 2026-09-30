import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

import {
  FlightSearchExtractionSchema,
} from "../schemas/flight-search-extraction.schema.js";

import {
  buildFlightSearchExtractionPrompt,
} from "../prompts/flight-search.prompt.js";

import {
  openAI,
} from "../model/openai.js";

const extractionModel =
  openAI.withStructuredOutput(
    FlightSearchExtractionSchema,
    {
      name: "FlightSearchExtraction",
      strict: true,
    }
  );

export const extractSearchNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    const userMessage =
      state.lastUserMessage?.trim();

    if (!userMessage) {
      return {};
    }

    const prompt =
      buildFlightSearchExtractionPrompt(
        userMessage
      );

    const extracted =
      await extractionModel.invoke(
        prompt
      );

    console.log(
      "Extracted Search:",
      extracted
    );

    return {
      extractedSearch: extracted,
    };
  };