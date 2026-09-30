import {
  flightGraph,
} from "./flight.graph.js";

async function main() {
  const sessionId =
    "session-001";

  const config = {
    configurable: {
      thread_id: sessionId,
    },
  };

  console.log(
    "\n========== MESSAGE 1 =========="
  );

  const firstResult =
    await flightGraph.invoke(
      {
        sessionId,

        lastUserMessage:
          "I want to go from Delhi to Mumbai",
      },
      config
    );

  console.log(
    JSON.stringify(
      {
        intent:
          firstResult.intent,

        extractedSearch:
          firstResult.extractedSearch,

        search:
          firstResult.search,

        missingFields:
          firstResult.missingFields,

        resolutionErrors:
          firstResult.resolutionErrors,

        assistantMessage:
          firstResult.assistantMessage,
      },
      null,
      2
    )
  );

  console.log(
    "\n========== MESSAGE 2 =========="
  );

  const secondResult =
    await flightGraph.invoke(
      {
        sessionId,

        lastUserMessage:
          "Tomorrow",
      },
      config
    );

  console.log(
    JSON.stringify(
      {
        intent:
          secondResult.intent,

        extractedSearch:
          secondResult.extractedSearch,

        search:
          secondResult.search,

        missingFields:
          secondResult.missingFields,

        resolutionErrors:
          secondResult.resolutionErrors,

        assistantMessage:
          secondResult.assistantMessage,
      },
      null,
      2
    )
  );
}

main().catch(console.error);