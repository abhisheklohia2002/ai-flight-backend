export interface FlightSearchRequest {
  tripType: "ONE_WAY" | "ROUND_TRIP";

  origin: string;
  destination: string;

  departureDate: string;
  returnDate?: string;

  cabinClass:
    | "ECONOMY"
    | "PREMIUM_ECONOMY"
    | "BUSINESS"
    | "FIRST";

  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchResult {
  traceId: string;
  expiryAt: string;
  flights: FlightOption[];
}

export interface FlightOption {
  id: string;

  resultIndex?: string;
  fareBrand?: string;
  isLcc?: boolean;
  reviewUrl?: string;

  airline: {
    code: string;
    name: string;
    logo?: string | null;
  };

  flightNumber: string;

  origin: string;
  destination: string;

  departureTime: string;
  arrivalTime: string;

  durationMinutes: number;

  stops: number;

  via: string[];

  price: {
    amount: number;
    currency: string;
  };

  refundable: boolean;

  seatsLeft?: number | null;
}