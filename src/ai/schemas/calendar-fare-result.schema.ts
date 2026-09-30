import { z } from "zod";

export const CalendarFareResultSchema =
  z.object({

    traceId:
      z.string(),

    origin:
      z.string(),

    destination:
      z.string(),

    fares:
      z.array(
        z.object({

          airlineCode:
            z.string(),

          airlineName:
            z.string(),

          departureDate:
            z.string(),

          fare:
            z.number(),

          baseFare:
            z.number(),

          tax:
            z.number(),

          otherCharges:
            z.number(),

          fuelSurcharge:
            z.number(),

          currency:
            z.string(),

          isLowestFareOfMonth:
            z.boolean(),

          isHighestFareOfMonth:
            z.boolean(),

        })
      ),

  });