import {
  flightGraph,
} from "../../ai/graph/flight.graph.js";

import type {
  ChatRequest,
  ChatResponse,
} from "./chat.types.js";


export class ChatService {

  async sendMessage(
    request: ChatRequest
  ): Promise<ChatResponse> {

    const {
      sessionId,
      message,
    } = request;


    const result =
      await flightGraph.invoke(
        {
          sessionId,

          lastUserMessage:
            message,
        },

        {
          configurable: {
            thread_id:
              sessionId,
          },
        }
      );


    /*
     * Infrastructure / provider error
     */
    if (result.error) {

      return {
        sessionId,

        type:
          "ERROR",

        message:
          result.assistantMessage ??
          "Something went wrong while processing your request.",
      };
    }


    /*
     * Assistant is asking user
     * for missing information.
     */
    if (
      result.missingFields?.length > 0 ||
      result.resolutionErrors?.length > 0 ||
      result.validationErrors?.length > 0
    ) {

      return {
        sessionId,

        type:
          "ASK_MISSING_INFO",

        message:
          result.assistantMessage ??
          "I need some more information.",
      };
    }


    /*
     * Calendar fare response
     */
    if (
      result.calendarResults &&
      result.calendarResults.length > 0
    ) {

      return {
        sessionId,

        type:
          "CALENDAR_RESULTS",

        message:
          result.assistantMessage ??
          "I found fare information for these dates.",

        data: {
          calendarFares:
            result.calendarResults,
        },
      };
    }


    if (
      result.searchResults &&
      result.searchResults.length > 0
    ) {

      return {
        sessionId,

        type:
          "FLIGHT_RESULTS",

        message:
          result.assistantMessage ??
          `I found ${result.searchResults.length} flights.`,

        data: {
          flights:
            result.searchResults,

          search:
            result.search,

          traceId:
            result.traceId,

          expiryAt:
            result.searchExpiryAt,
        },
      };
    }


    return {
      sessionId,

      type:
        "MESSAGE",

      message:
        result.assistantMessage ??
        "How can I help you with your flight search?",
    };
  }
}


export const chatService =
  new ChatService();