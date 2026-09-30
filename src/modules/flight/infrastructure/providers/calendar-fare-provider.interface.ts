import type {
  CalendarFareRequest,
  CalendarFareResult,
} from "../../domain/calendar-fare.js";

export interface CalendarFareProvider {
  searchCalendarFares(
    request: CalendarFareRequest
  ): Promise<CalendarFareResult[]>;
}