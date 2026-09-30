import type {
  GraphNode,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "../graph/state.js";

import {
  CalendarFareExtractionSchema,
} from "../schemas/calendar-fare-extraction.schema.js";

import {
  buildCalendarFarePrompt,
} from "../prompts/calendar-fare.prompt.js";

import {
  openAI,
} from "../model/openai.js";


const calendarExtractionModel =
  openAI.withStructuredOutput(
    CalendarFareExtractionSchema,
    {
      name:
        "CalendarFareExtraction",

      strict:
        true,
    }
  );


export const extractCalendarFareNode:
  GraphNode<
    typeof FlightAssistantState
  > =
  async (state) => {

    const message =
      state.lastUserMessage?.trim();

    if (!message) {
      return {};
    }

    const prompt =
      buildCalendarFarePrompt(
        message
      );

    const extracted =
      await calendarExtractionModel
        .invoke(prompt);

    console.log(
      "Calendar extraction:",
      extracted
    );

    return {
      calendarExtraction:
        extracted,
    };
  };