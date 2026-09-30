import type {
  GraphNode,
} from "@langchain/langgraph";

import { openAI } from "../model/openai.js";

import {
  FlightIntentSchema,
} from "../schemas/intent.schema.js";

import {
  buildIntentPrompt,
} from "../prompts/intent.prompt.js";

import {
  FlightAssistantState,
} from "../graph/state.js";

const intentModel =
  openAI.withStructuredOutput(
    FlightIntentSchema,
    {
      name: "FlightIntent",
      strict: true,
    }
  );

export const detectIntentNode:
  GraphNode<typeof FlightAssistantState> =
  async (state) => {

    const userMessage =
      state.lastUserMessage?.trim();

    if (!userMessage) {
      return {
        intent: "UNKNOWN",
      };
    }

    const hasActiveSearch =
  Boolean(
    state.search?.origin ||
    state.search?.destination ||
    state.search?.departureDate
  );

    const prompt =
  buildIntentPrompt(
    userMessage,
    hasActiveSearch
  );
    const result =
      await intentModel.invoke(prompt);

    console.log(
      "Detected Intent:",
      result.intent
    );

    console.log(
      "Confidence:",
      result.confidence
    );

    return {
      intent: result.intent,
    };
  };