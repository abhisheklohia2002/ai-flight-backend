import { z } from "zod";

export const FlightOptionSchema =
  z.object({
    id: z.string(),

    airline: z.object({
      code: z.string(),
      name: z.string(),
      logo: z
        .string()
        .nullable()
        .optional(),
    }),

    flightNumber: z.string(),

    origin: z.string(),
    destination: z.string(),

    departureTime: z.string(),
    arrivalTime: z.string(),

    durationMinutes:
      z.number(),

    stops:
      z.number(),

    via:
      z.array(
        z.string()
      ),

    price: z.object({
      amount:
        z.number(),

      currency:
        z.string(),
    }),

    refundable:
      z.boolean(),

    seatsLeft:
      z.number()
        .nullable()
        .optional(),
  });