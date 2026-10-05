export interface TripXLNearbyAirport {
  name: string;
  code: string;
  city: string;
  country: string;
  distance: number;
}


export interface TripXLAirport {
  name: string;
  code: string;
  city: string;
  country: string;

  radius?: number;

  nearbyAirports?:
    TripXLNearbyAirport[];
}


export type TripXLAirportSearchResponse =
  TripXLAirport[];