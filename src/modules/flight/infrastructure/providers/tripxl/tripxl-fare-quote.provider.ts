import {
  Agent,
  fetch,
} from "undici";

import {
  env,
} from "../../../../../config/env.js";

import {
  FareQuoteSchema,
} from "../../../../../ai/schemas/fare-quote.schema.js";

import type {
  FareQuote,
} from "../../../../../ai/schemas/fare-quote.schema.js";

import type {
  FareQuoteRequest,
} from "../../../domain/fare-quote.js";

import type {
  FareQuoteProvider,
} from "../fare-quote-provider.interface.js";


const tripXLDispatcher =
  new Agent({
    connectTimeout: 60_000,
    headersTimeout: 90_000,
    bodyTimeout: 90_000,
  });


export class TripXLFareQuoteProvider
  implements FareQuoteProvider {

  async getFareQuote(
    request: FareQuoteRequest
  ): Promise<FareQuote> {

    const url =
      `${env.TRIPXL_API_BASE_URL}${env.TRIPXL_FARE_QUOTE_PATH}`;

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => {
          controller.abort();
        },
        env.TRIPXL_API_TIMEOUT_MS
      );


    try {

      console.log(
        "Calling TripXL fare quote:",
        {
          traceId:
            request.traceId,

          selections:
            request.selections,
        }
      );


      console.log("Fare quote request:", {
  method: "POST",
  url,
  traceId: request.traceId,
  selections: request.selections,
});
      const response =
        await fetch(
          url,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",

              "X-Access-Key":
                env.TRIPXL_ACCESS_KEY,
            },

            body:
              JSON.stringify(
                request
              ),

            signal:
              controller.signal,

            dispatcher:
              tripXLDispatcher,
                redirect: "manual",
          }
        );

        console.log("Fare quote HTTP response:", {
  status:
    response.status,

  url:
    response.url,

  redirected:
    response.redirected,

  location:
    response.headers.get(
      "location"
    ),
});

      if (!response.ok) {

        const responseBody =
          await response.text();

        throw new Error(
          `TripXL fare quote failed: ${response.status} ${responseBody}`
        );
      }


     const rawData =
  await response.json();

if (
  typeof rawData !==
    "object" ||
  rawData === null ||
  Array.isArray(rawData)
) {
  throw new Error(
    "Invalid TripXL fare quote response."
  );
}

return FareQuoteSchema.parse({
  ...rawData,

  traceId:
    request.traceId,
});

    } catch (error) {

      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {

        throw new Error(
          "TripXL fare quote timed out."
        );
      }

      throw error;

    } finally {

      clearTimeout(
        timeout
      );
    }
  }
}