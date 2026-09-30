export interface TripXLSearchResponse {
  traceId: string;
  tripType: string;
  isSpecialFlight: boolean;
  origin: string;
  destination: string;
  isInternational: boolean;
  expiryAt: string;

  journeys: {
    onward: TripXLItinerary[];
    return?: TripXLItinerary[];
  };
}

export interface TripXLItinerary {
  id: string;
  isLcc?: boolean;
  fareBrand?: string;
  airline: {
    code: string;
    name: string;
    logo?: string | null;
    operatingCarrier?: string | null;
  };

  flightNumber: string;

  departure: {
    airportCode: string;
    airportName: string;
    city: string;
    localTime: string;
    terminal?: string | null;
  };

  arrival: {
    airportCode: string;
    airportName: string;
    city: string;
    localTime: string;
    terminal?: string | null;
  };

  durationMinutes: number;
  stops: number;
  via?: string[];

  lowestFare?: {
    resultIndex: string;
    totalFare: number;
    refundable: boolean;
    seatsLeft?: number;

    fare: {
      currency: string;
      baseFare: number;
      tax: number;
      publishedFare: number;
      offeredFare: number;
    };
  };
}

export interface TripXLSearchRequest {
  journeyType: number;

  segments: {
    origin: string;
    destination: string;
    departureDate: string;
  }[];

  cabinClass: number;

  fareType: number;

  adult: number;
  child: number;
  infant: number;

  originCountryName: string;
  destinationCountryName: string;

  searchType: number;
}

export interface TripXLCalendarFareRequest {
  journeyType: number;

  cabinClass: number;

  segments: {
    origin: string;
    destination: string;
    departureDate: string;
  }[];
}

export interface TripXLCalendarFareItem {
  TraceId: string;

  Origin: string;
  Destination: string;

  CalendarResult: {
    AirlineCode: string;
    AirlineName: string;

    DepartureDate: string;

    Fare: number;
    BaseFare: number;
    Tax: number;
    OtherCharges: number;
    FuelSurcharge: number;

    Currency: string;

    IsLowestFareOfMonth: boolean;
    IsHighestFareOfMonth: boolean;
  }[];
}

export type TripXLCalendarFareResponse = TripXLCalendarFareItem[];
