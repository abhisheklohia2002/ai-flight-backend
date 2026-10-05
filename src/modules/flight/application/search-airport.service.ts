import {
  TripXLAirportProvider,
} from "../infrastructure/providers/tripxl/tripxl-airport.provider.js";

import type {
  Airport,
} from "../domain/airport.js";


const airportProvider =
  new TripXLAirportProvider();


export class SearchAirportService {

  async execute(
    search: string
  ) {

    return airportProvider
      .searchAirports(
        search
      );
  }
}


export const
  searchAirportService =
    new SearchAirportService();

export type AirportResolution =
  | { kind: "RESOLVED"; airport: Airport }
  | { kind: "NOT_FOUND" }
  | { kind: "AMBIGUOUS"; airports: Airport[] };

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

/** TripXL supplies airport codes; ambiguous results always require a choice. */
export async function resolveAirportSearch(search: string): Promise<AirportResolution> {
  const airports = await searchAirportService.execute(search);

  if (airports.length === 0) {
    return { kind: "NOT_FOUND" };
  }

  const query = normalize(search);
  const exactMatches = airports.filter((airport) =>
    [airport.code, airport.city, airport.name]
      .some((value) => normalize(value) === query)
  );

  if (exactMatches.length === 1 && exactMatches[0]) {
    return { kind: "RESOLVED", airport: exactMatches[0] };
  }

  if (airports.length === 1 && airports[0]) {
    return { kind: "RESOLVED", airport: airports[0] };
  }

  return { kind: "AMBIGUOUS", airports: airports.slice(0, 10) };
}
