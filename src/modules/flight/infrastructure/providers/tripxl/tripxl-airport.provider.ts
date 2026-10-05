import {
  Agent,
  fetch,
} from "undici";

import {
  env,
} from "../../../../../config/env.js";

import type {
  Airport,
} from "../../../domain/airport.js";


const tripXLDispatcher =
  new Agent({
    connectTimeout:
      60_000,

    headersTimeout:
      90_000,

    bodyTimeout:
      90_000,
  });


export class TripXLAirportProvider {

  async searchAirports(
    search: string
  ): Promise<Airport[]> {

    const cleanSearch =
      search.trim();


    if (
      cleanSearch.length <
      2
    ) {
      return [];
    }


    const params =
      new URLSearchParams({
        search:
          cleanSearch,
      });


    const url =
      `${env.TRIPXL_API_BASE_URL}${env.TRIPXL_AIRPORT_SEARCH_PATH}?${params.toString()}`;


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

      const response =
        await fetch(
          url,
          {
            method:
              "GET",

            headers: {
              Accept:
                "application/json",

              "X-Access-Key":
                env.TRIPXL_ACCESS_KEY,
            },

            signal:
              controller.signal,

            dispatcher:
              tripXLDispatcher,
          }
        );


      if (
        !response.ok
      ) {

        const responseBody =
          await response.text();


        throw new Error(
          `TripXL airport search failed: ${response.status} ${responseBody}`
        );
      }


      const rawData:
        unknown =
        await response.json();


      if (
        !Array.isArray(
          rawData
        )
      ) {

        throw new Error(
          "TripXL returned an invalid airport search response."
        );
      }


      return rawData as
        Airport[];

    } catch (error) {

      if (
        error instanceof
          Error &&
        error.name ===
          "AbortError"
      ) {

        throw new Error(
          "TripXL airport search timed out."
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