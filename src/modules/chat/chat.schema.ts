import {
  z,
} from "zod";
import { PassengerDetailsSchema } from "../flight/domain/passenger-details.js";
import { SsrSelectionsSchema } from "../../ai/schemas/booking-prepare.schema.js";


export const ChatRequestSchema =
  z.object({
    sessionId:
      z.string(),

    message:
      z.string()
        .optional(),

    action:
      z.enum([
        "MESSAGE",
        "SET_ORIGIN",
        "START_BOOKING",
        "SUBMIT_PASSENGER_DETAILS",
        "PREPARE_BOOKING",
      ])
      .optional(),

    origin:
      z.string()
        .optional(),

    flightId:
      z.string()
        .optional(),

    passengerDetails:
      PassengerDetailsSchema
        .optional(),
    ssrSelections: SsrSelectionsSchema.optional(),
  });
