import type {
  FlightSearchRequest,
  FlightSearchResult,
} from "../../domain/flight-search.js";

export interface FlightSearchProvider {
  searchFlights(
    request: FlightSearchRequest
  ): Promise<FlightSearchResult>;
}