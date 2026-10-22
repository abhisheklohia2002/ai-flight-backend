import { Agent, fetch } from "undici";
import { BookingPrepareResponseSchema, type BookingPrepareResponse } from "../../../../../ai/schemas/booking-prepare.schema.js";
import { env } from "../../../../../config/env.js";
const dispatcher = new Agent({ connectTimeout: 60_000, headersTimeout: 90_000, bodyTimeout: 90_000 });
export async function prepareBooking(request: unknown): Promise<BookingPrepareResponse> {
  const response = await fetch(`${env.TRIPXL_API_BASE_URL}${env.TRIPXL_BOOKING_PREPARE_PATH}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "X-Access-Key": env.TRIPXL_ACCESS_KEY }, body: JSON.stringify(request), dispatcher });
  if (!response.ok) throw new Error(`TripXL booking prepare failed: ${response.status} ${await response.text()}`);
  return BookingPrepareResponseSchema.parse(await response.json());
}
