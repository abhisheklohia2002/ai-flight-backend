import {
  Agent,
  fetch,
} from "undici";

import type {
  TripXLSearchResponse,
} from "./tripxl.types.js";

import type {
  FlightOption,
  FlightSearchRequest,
  FlightSearchResult,
} from "../../../domain/flight-search.js";

import type {
  FlightSearchProvider,
} from "../flight-search-provider.interface.js";

import {
  mapToTripXLRequest,
  mapTripXLFlight,
} from "./tripxl.mapper.js";

import {
  buildFlightReviewUrl,
} from "./build-flight-review-url.js";

import {
  env,
} from "../../../../../config/env.js";


/**
 * TripXL HTTP client configuration.
 *
 * connectTimeout:
 * Maximum time allowed to establish TCP/TLS connection.
 *
 * headersTimeout:
 * Maximum time waiting for response headers.
 *
 * bodyTimeout:
 * Maximum time while receiving response data.
 */
const tripXLDispatcher =
  new Agent({
    connectTimeout: 60_000,
    headersTimeout: 90_000,
    bodyTimeout: 90_000,
  });


export class TripXLFlightProvider
  implements FlightSearchProvider {

  async searchFlights(
    request: FlightSearchRequest
  ): Promise<FlightSearchResult> {

    /*
     * Convert internal domain request
     * to TripXL API payload.
     */
    const payload =
      mapToTripXLRequest(
        request
      );


    const url =
      `${env.TRIPXL_API_BASE_URL}${env.TRIPXL_FLIGHT_SEARCH_PATH}`;


    /*
     * Overall request timeout.
     */
    const controller =
      new AbortController();


    const timeout =
      setTimeout(
        () => {

          console.error(
            `TripXL request exceeded ${env.TRIPXL_API_TIMEOUT_MS}ms`
          );

          controller.abort();

        },
        env.TRIPXL_API_TIMEOUT_MS
      );


    try {

      console.log(
        "Calling TripXL URL:",
        url
      );


      console.log(
        "TripXL request:",
        payload
      );


      /*
       * Never log actual access key.
       */
      console.log(
        "TripXL access key configured:",
        Boolean(
          env.TRIPXL_ACCESS_KEY
        )
      );


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
                payload
              ),

            signal:
              controller.signal,

            dispatcher:
              tripXLDispatcher,
          }
        );


      console.log(
        "TripXL response status:",
        response.status
      );


      /*
       * Handle HTTP errors.
       */
      if (!response.ok) {

        const responseBody =
          await response.text();


        throw new Error(
          `TripXL search failed: ${response.status} ${responseBody}`
        );
      }


      /*
       * Parse TripXL response.
       */
      const rawData:
        unknown =
        await response.json();


      const data =
        rawData as TripXLSearchResponse;


      /*
       * Basic response validation.
       */
      if (
        !data ||
        !data.journeys ||
        !Array.isArray(
          data.journeys.onward
        )
      ) {

        throw new Error(
          "TripXL returned an invalid flight search response."
        );
      }


      const flights:
        FlightOption[] = [];


      /*
       * Convert TripXL itineraries
       * into our domain model.
       */
      for (
        const itinerary
        of data.journeys.onward
      ) {

        const flight =
          mapTripXLFlight(
            itinerary
          );


        /*
         * Skip itineraries without
         * required fare information.
         */
        if (!flight) {
          continue;
        }


        /*
         * Generate Flight360 review URL.
         *
         * Required:
         * - traceId
         * - resultIndex
         * - itinerary id
         * - passenger info
         * - fare brand
         * - LCC flag
         */
        if (
          flight.resultIndex &&
          flight.fareBrand &&
          typeof flight.isLcc ===
            "boolean"
        ) {

          flight.reviewUrl =
            buildFlightReviewUrl({
              traceId:
                data.traceId,

              resultIndex:
                flight.resultIndex,

              selectedItineraryId:
                flight.id,

              origin:
                request.origin,

              destination:
                request.destination,

              departureDate:
                request.departureDate,

              tripType:
                request.tripType,

              adults:
                request.adults,

              children:
                request.children,

              infants:
                request.infants,

              cabinClass:
                request.cabinClass,

              currency:
                flight.price.currency,

              fareBrand:
                flight.fareBrand,

              isLcc:
                flight.isLcc,

              isInternational:
                data.isInternational,
            });


          console.log(
            "Generated review URL:",
            flight.reviewUrl
          );

        } else {

          /*
           * Keep flight in results,
           * but Book Now will not be
           * available until these fields
           * are present.
           */
          console.warn(
            "Review URL could not be generated:",
            {
              itineraryId:
                flight.id,

              resultIndex:
                flight.resultIndex,

              fareBrand:
                flight.fareBrand,

              isLcc:
                flight.isLcc,
            }
          );
        }


        flights.push(
          flight
        );
      }


      console.log(
        `TripXL returned ${data.journeys.onward.length} itineraries`
      );


      console.log(
        `Mapped ${flights.length} flights`
      );


      return {
        traceId:
          data.traceId,

        expiryAt:
          data.expiryAt,

        flights,
      };


    } catch (error) {

      /*
       * AbortController timeout.
       */
      if (
        error instanceof Error &&
        error.name ===
          "AbortError"
      ) {

        console.error(
          "TripXL search request timed out:",
          {
            timeoutMs:
              env.TRIPXL_API_TIMEOUT_MS,
          }
        );


        throw new Error(
          "TripXL flight search timed out."
        );
      }


      /*
       * Network / Undici /
       * TripXL response error.
       */
      if (
        error instanceof Error
      ) {

        console.error(
          "TripXL search error:",
          {
            name:
              error.name,

            message:
              error.message,

            cause:
              error.cause,
          }
        );

      } else {

        console.error(
          "Unknown TripXL search error:",
          error
        );
      }


      throw error;

    } finally {

      /*
       * Always clear timeout.
       */
      clearTimeout(
        timeout
      );
    }
  }
}