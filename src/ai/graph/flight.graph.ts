import {
  START,
  END,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

import {
  FlightAssistantState,
} from "./state.js";

import {
  detectIntentNode,
} from "../nodes/detect-intent.node.js";

import {
  extractSearchNode,
} from "../nodes/extract-search.node.js";

import {
  resolveSearchNode,
} from "../nodes/resolve-search.node.js";

import {
  validateSearchNode,
} from "../nodes/validate-search.node.js";

import {
  askMissingInfoNode,
} from "../nodes/ask-missing-info.node.js";

import {
  searchFlightsNode,
} from "../nodes/search-flights.node.js";

import {
  extractCalendarFareNode,
} from "../nodes/extract-calendar-fare.node.js";

import {
  resolveCalendarFareNode,
} from "../nodes/resolve-calendar-fare.node.js";

import {
  calendarFareNode,
} from "../nodes/calendar-fare.node.js";

import {
  filterFlightResultsNode,
} from "../nodes/filter-flight-results.node.js";
import { resetSearchNode } from "../nodes/reset-search.node.js";



/*
 * Runs at the beginning of every graph invocation.
 *
 * We clear temporary response/error state,
 * but DO NOT clear search/memory because
 * follow-up messages need it.
 */
async function initializeAssistant(
  state:
    typeof FlightAssistantState.State
) {
  console.log(
    "Session:",
    state.sessionId
  );

  return {
    error:
      undefined,

    assistantMessage:
      undefined,
  };
}


/*
 * Decide whether the current message
 * is a continuation of an existing
 * incomplete search.
 *
 * Example:
 *
 * User: Delhi to Mumbai
 * AI: What date?
 *
 * User: Tomorrow
 *
 * In this case we skip intent detection
 * and directly extract the missing data.
 */
function routeConversationEntry(
  state:
    typeof FlightAssistantState.State
) {

  if (
    state.missingFields &&
    state.missingFields.length > 0
  ) {

    console.log(
      "Continuing existing flight search"
    );

    return "extractSearch";
  }


  if (
    state.resolutionErrors &&
    state.resolutionErrors.length > 0
  ) {

    console.log(
      "Retrying search field resolution"
    );

    return "extractSearch";
  }


  return "detectIntent";
}


/*
 * Route based on detected user intent.
 */
function routeAfterIntent(
  state:
    typeof FlightAssistantState.State
) {

  switch (state.intent) {

    /*
     * Brand-new search.
     *
     * We reset old route/date/filter/result state.
     */
    case "SEARCH_FLIGHT":
      return "resetSearch";


    /*
     * Modify existing search.
     *
     * Examples:
     * - only SpiceJet
     * - make it 2 adults
     * - change date to Friday
     */
    case "MODIFY_SEARCH":
      return "extractSearch";


    /*
     * Calendar fare endpoint.
     */
    case "CALENDAR_SEARCH":
      return "extractCalendarFare";


    default:
      return "unsupported";
  }
}


/*
 * After search information has been
 * extracted, resolved and validated,
 * decide what to do next.
 */
function routeAfterValidation(
  state:
    typeof FlightAssistantState.State
) {

  /*
   * Airport/date resolution problem.
   */
  if (
    state.resolutionErrors.length > 0
  ) {
    return "askMissingInfo";
  }


  /*
   * Business validation problem.
   */
  if (
    state.validationErrors.length > 0
  ) {
    return "askMissingInfo";
  }


  /*
   * Required information still missing.
   */
  if (
    state.missingFields.length > 0
  ) {
    return "askMissingInfo";
  }


  /*
   * MODIFY_SEARCH may only contain
   * local filters.
   *
   * Example:
   *
   * "Only SpiceJet"
   * "Direct only"
   * "Under 5000"
   * "Evening flights"
   *
   * In that case we don't need another
   * TripXL API call if results already exist.
   */
  if (
    state.intent ===
      "MODIFY_SEARCH" &&
    state.allSearchResults.length > 0
  ) {

    const extracted =
      state.extractedSearch;


    if (extracted) {

      /*
       * These fields affect the actual
       * flight search/fare.
       *
       * Changing any of them means
       * TripXL must be called again.
       */
      const requiresNewSearch =
        extracted.originText !== null ||
        extracted.destinationText !== null ||
        extracted.departureDateText !== null ||
        extracted.returnDateText !== null ||
        extracted.tripType !== null ||
        extracted.adults !== null ||
        extracted.children !== null ||
        extracted.infants !== null ||
        extracted.cabinClass !== null;


      if (!requiresNewSearch) {

        console.log(
          "Using existing results for filtering"
        );

        return "filterFlightResults";
      }
    }
  }


  /*
   * New search or meaningful search
   * modification.
   */
  return "searchFlights";
}


/*
 * TripXL search can fail.
 *
 * If it fails, don't send an empty
 * result set into filterFlightResults.
 */
function routeAfterFlightSearch(
  state:
    typeof FlightAssistantState.State
) {

  if (state.error) {

    console.log(
      "Flight search failed - skipping filtering"
    );

    return "end";
  }


  return "filterFlightResults";
}


/*
 * Intents we haven't implemented yet.
 */
async function unsupportedNode(
  state:
    typeof FlightAssistantState.State
) {

  console.log(
    "Unsupported intent:",
    state.intent
  );

  return {
    assistantMessage:
      "I can currently help you search flights and compare flight fares.",
  };
}


/*
 * GRAPH
 */
const workflow =
  new StateGraph(
    FlightAssistantState
  )


    /*
     * NODES
     */

    .addNode(
      "initializeAssistant",
      initializeAssistant
    )

    .addNode(
      "detectIntent",
      detectIntentNode
    )

    .addNode(
      "resetSearch",
      resetSearchNode
    )

    .addNode(
      "extractSearch",
      extractSearchNode
    )

    .addNode(
      "resolveSearch",
      resolveSearchNode
    )

    .addNode(
      "validateSearch",
      validateSearchNode
    )

    .addNode(
      "askMissingInfo",
      askMissingInfoNode
    )

    .addNode(
      "searchFlights",
      searchFlightsNode
    )

    .addNode(
      "filterFlightResults",
      filterFlightResultsNode
    )

    .addNode(
      "extractCalendarFare",
      extractCalendarFareNode
    )

    .addNode(
      "resolveCalendarFare",
      resolveCalendarFareNode
    )

    .addNode(
      "calendarFare",
      calendarFareNode
    )

    .addNode(
      "unsupported",
      unsupportedNode
    )


    /*
     * START
     */

    .addEdge(
      START,
      "initializeAssistant"
    )


    /*
     * Decide whether we're handling
     * a continuation or a new intent.
     */

    .addConditionalEdges(
      "initializeAssistant",
      routeConversationEntry,
      {
        detectIntent:
          "detectIntent",

        extractSearch:
          "extractSearch",
      }
    )


    /*
     * INTENT ROUTING
     */

    .addConditionalEdges(
      "detectIntent",
      routeAfterIntent,
      {
        resetSearch:
          "resetSearch",

        extractSearch:
          "extractSearch",

        extractCalendarFare:
          "extractCalendarFare",

        unsupported:
          "unsupported",
      }
    )


    /*
     * NEW SEARCH
     */

    .addEdge(
      "resetSearch",
      "extractSearch"
    )


    /*
     * NORMAL SEARCH FLOW
     */

    .addEdge(
      "extractSearch",
      "resolveSearch"
    )

    .addEdge(
      "resolveSearch",
      "validateSearch"
    )


    /*
     * VALIDATION ROUTING
     */

    .addConditionalEdges(
      "validateSearch",
      routeAfterValidation,
      {
        askMissingInfo:
          "askMissingInfo",

        searchFlights:
          "searchFlights",

        filterFlightResults:
          "filterFlightResults",
      }
    )


    /*
     * ASK USER FOR MISSING DATA
     */

    .addEdge(
      "askMissingInfo",
      END
    )


    /*
     * AFTER TRIPXL SEARCH
     *
     * Success → filtering
     * Failure → END
     */

    .addConditionalEdges(
      "searchFlights",
      routeAfterFlightSearch,
      {
        filterFlightResults:
          "filterFlightResults",

        end:
          END,
      }
    )


    /*
     * FILTERED SEARCH RESULTS
     */

    .addEdge(
      "filterFlightResults",
      END
    )


    /*
     * CALENDAR FARE FLOW
     */

    .addEdge(
      "extractCalendarFare",
      "resolveCalendarFare"
    )

    .addEdge(
      "resolveCalendarFare",
      "calendarFare"
    )

    .addEdge(
      "calendarFare",
      END
    )


    /*
     * UNSUPPORTED INTENT
     */

    .addEdge(
      "unsupported",
      END
    );


/*
 * In-memory conversation state.
 *
 * Later this can be replaced by
 * persistent storage if needed.
 */
const memory =
  new MemorySaver();


export const flightGraph =
  workflow.compile({
    checkpointer:
      memory,
  });