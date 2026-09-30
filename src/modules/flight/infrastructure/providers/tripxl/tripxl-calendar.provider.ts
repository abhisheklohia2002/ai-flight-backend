import {
  env,
} from "../../../../../config/env.js";

import type {
  CalendarFareRequest,
  CalendarFareResult,
} from "../../../domain/calendar-fare.js";

import type {
  CalendarFareProvider,
} from "../calendar-fare-provider.interface.js";

import type {
  TripXLCalendarFareResponse,
} from "./tripxl.types.js";

import {
  mapToTripXLCalendarRequest,
  mapTripXLCalendarResponse,
} from "./tripxl-calendar.mapper.js";


export class TripXLCalendarFareProvider
  implements CalendarFareProvider {

  async searchCalendarFares(
    request: CalendarFareRequest
  ): Promise<CalendarFareResult[]> {

    const payload =
      mapToTripXLCalendarRequest(
        request
      );

    const url =
      `${env.TRIPXL_API_BASE_URL}${env.TRIPXL_CALENDAR_FARE_PATH}`;

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
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
                 "Accept":
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
          }
        );

      if (!response.ok) {

        const body =
          await response.text();

        throw new Error(
          `TripXL calendar fare failed: ${response.status} ${body}`
        );
      }

      const rawData:
        unknown =
        await response.json();

      const data =
        rawData as TripXLCalendarFareResponse;

      return mapTripXLCalendarResponse(
        data
      );

    } finally {

      clearTimeout(
        timeout
      );
    }
  }
}