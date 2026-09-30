import type {
  CalendarFareRequest,
  CalendarFareResult,
} from "../domain/calendar-fare.js";

import type {
  CalendarFareProvider,
} from "../infrastructure/providers/calendar-fare-provider.interface.js";


export class CalendarFareService {

  constructor(
    private readonly provider:
      CalendarFareProvider
  ) {}

  async execute(
    request: CalendarFareRequest
  ): Promise<CalendarFareResult[]> {

    return this.provider
      .searchCalendarFares(
        request
      );
  }
}