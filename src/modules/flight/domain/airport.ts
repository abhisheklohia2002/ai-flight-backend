export interface NearbyAirport {
  name: string;
  code: string;
  city: string;
  country: string;
  distance: number;
}


export interface Airport {
  name: string;
  code: string;
  city: string;
  country: string;
  radius: number;

  nearbyAirports:
    NearbyAirport[];
}