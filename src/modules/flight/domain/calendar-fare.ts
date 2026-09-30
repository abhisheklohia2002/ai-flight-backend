export interface CalendarFareSegment {
  origin: string;
  destination: string;
  departureDate: string;
}

export interface CalendarFareRequest {
  tripType: "ONE_WAY" | "ROUND_TRIP";

  cabinClass:
    | "ECONOMY"
    | "PREMIUM_ECONOMY"
    | "BUSINESS"
    | "FIRST";

  segments: CalendarFareSegment[];
}

export interface CalendarFareOption {
  airlineCode: string;
  airlineName: string;

  departureDate: string;

  fare: number;
  baseFare: number;
  tax: number;
  otherCharges: number;
  fuelSurcharge: number;

  currency: string;

  isLowestFareOfMonth: boolean;
  isHighestFareOfMonth: boolean;
}

export interface CalendarFareResult {
  traceId: string;

  origin: string;
  destination: string;

  fares: CalendarFareOption[];
}