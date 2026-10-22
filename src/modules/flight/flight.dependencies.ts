import {
  SearchFlightService,
} from "./application/search-flight.service.js";

import {
  CalendarFareService,
} from "./application/calendar-fare.service.js";

import {
  TripXLFlightProvider,
} from "./infrastructure/providers/tripxl/tripxl-flight.provider.js";

import {
  TripXLCalendarFareProvider,
} from "./infrastructure/providers/tripxl/tripxl-calendar.provider.js";
import { TripXLFareQuoteProvider } from "./infrastructure/providers/tripxl/tripxl-fare-quote.provider.js";
import { FareQuoteService } from "./application/fare-quote.service.js";


const tripXLFlightProvider =
  new TripXLFlightProvider();

const tripXLCalendarFareProvider =
  new TripXLCalendarFareProvider();


export const searchFlightService =
  new SearchFlightService(
    tripXLFlightProvider
  );


export const calendarFareService =
  new CalendarFareService(
    tripXLCalendarFareProvider
  );


  const fareQuoteProvider =
  new TripXLFareQuoteProvider();


export const fareQuoteService =
  new FareQuoteService(
    fareQuoteProvider
  );