import type {
  CalendarFareRequest,
  CalendarFareResult,
} from "../../../domain/calendar-fare.js";

import type {
  TripXLCalendarFareRequest,
  TripXLCalendarFareResponse,
} from "./tripxl.types.js";


export function mapToTripXLCalendarRequest(
  request: CalendarFareRequest
): TripXLCalendarFareRequest {

  if (
    request.tripType !==
    "ONE_WAY"
  ) {
    throw new Error(
      "ROUND_TRIP calendar mapping is not configured yet."
    );
  }

  if (
    request.cabinClass !==
    "ECONOMY"
  ) {
    throw new Error(
      "Only ECONOMY calendar mapping is currently configured."
    );
  }

  return {
    journeyType: 1,

    cabinClass: 2,

    segments:
      request.segments.map(
        (segment) => ({
          origin:
            segment.origin,

          destination:
            segment.destination,

          departureDate:
            segment.departureDate,
        })
      ),
  };
}


export function mapTripXLCalendarResponse(
  response: TripXLCalendarFareResponse
): CalendarFareResult[] {

  return response.map(
    (item) => ({
      traceId:
        item.TraceId,

      origin:
        item.Origin,

      destination:
        item.Destination,

      fares:
        item.CalendarResult.map(
          (fare) => ({
            airlineCode:
              fare.AirlineCode,

            airlineName:
              fare.AirlineName,

            departureDate:
              fare.DepartureDate,

            fare:
              fare.Fare,

            baseFare:
              fare.BaseFare,

            tax:
              fare.Tax,

            otherCharges:
              fare.OtherCharges,

            fuelSurcharge:
              fare.FuelSurcharge,

            currency:
              fare.Currency,

            isLowestFareOfMonth:
              fare.IsLowestFareOfMonth,

            isHighestFareOfMonth:
              fare.IsHighestFareOfMonth,
          })
        ),
    })
  );
}