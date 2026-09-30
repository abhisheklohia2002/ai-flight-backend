import type {
  FlightSearchRequest,
  FlightSearchResult,
} from "../domain/flight-search.js";

import type {
  FlightSearchProvider,
} from "../infrastructure/providers/flight-search-provider.interface.js";

export class SearchFlightService {

  constructor(
    private readonly provider:
      FlightSearchProvider
  ) {}

  async execute(
    request: FlightSearchRequest
  ): Promise<FlightSearchResult> {

    return this.provider
      .searchFlights(
        request
      );
  }
}