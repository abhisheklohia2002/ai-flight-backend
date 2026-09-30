import type {
  FlightOption,
  FlightSearchRequest,
} from "../../../domain/flight-search.js";

import type {
  TripXLItinerary,
  TripXLSearchRequest,
} from "./tripxl.types.js";

export function mapToTripXLRequest(
  request: FlightSearchRequest
): TripXLSearchRequest {

  return {
    journeyType: 1,

    segments: [
      {
        origin: request.origin,
        destination: request.destination,
        departureDate: request.departureDate,
      },
    ],

    cabinClass: 2,

    fareType: 2,

    adult: request.adults,
    child: request.children,
    infant: request.infants,

    originCountryName: "India",
    destinationCountryName: "India",

    searchType: 0,
  };
}

export function mapTripXLFlight(
  itinerary: TripXLItinerary
): FlightOption | null {
  const lowestFare =
    itinerary.lowestFare;

  if (!lowestFare) {
    return null;
  }

  return {
    id: itinerary.id,

    resultIndex:
      lowestFare.resultIndex,

    fareBrand:
      itinerary.fareBrand,

    isLcc:
      itinerary.isLcc,

    airline: {
      code:
        itinerary.airline.code,

      name:
        itinerary.airline.name,

      logo:
        itinerary.airline.logo ?? null,
    },

    flightNumber:
      itinerary.flightNumber,

    origin:
      itinerary.departure.airportCode,

    destination:
      itinerary.arrival.airportCode,

    departureTime:
      itinerary.departure.localTime,

    arrivalTime:
      itinerary.arrival.localTime,

    durationMinutes:
      itinerary.durationMinutes,

    stops:
      itinerary.stops,

    via:
      itinerary.via ?? [],

    price: {
      amount:
        lowestFare.totalFare,

      currency:
        lowestFare.fare.currency,
    },

    refundable:
      lowestFare.refundable,

    seatsLeft:
      lowestFare.seatsLeft ?? null,
  };
}