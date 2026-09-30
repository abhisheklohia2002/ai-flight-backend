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