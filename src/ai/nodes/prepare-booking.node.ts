import type { GraphNode } from "@langchain/langgraph";
import { FlightAssistantState } from "../graph/state.js";
import { prepareBooking } from "../../modules/flight/infrastructure/providers/tripxl/tripxl-booking.provider.js";

export const prepareBookingNode: GraphNode<typeof FlightAssistantState> = async (state) => {
  if (!state.fareQuote || !state.passengerDetails || !state.selectedFlightId || !state.selectedFlightResultIndex || !state.bookingTraceId) return { error: "BOOKING_CONTEXT_REQUIRED", assistantMessage: "Your booking context is unavailable. Please search again." };
  const fareQuote = state.fareQuote;
  const passengerDetails = state.passengerDetails;
  const leg = fareQuote.legs[0];
  if (!leg) return { error: "BOOKING_LEG_REQUIRED", assistantMessage: "The selected flight details are unavailable." };
  const typeMap = { ADULT: "ADT", CHILD: "CHD", INFANT: "INF" } as const;
  const selections = state.ssrSelections ?? [];
  const providerLeg = leg as typeof leg & { options?: { isLcc?: boolean; resultFareType?: string }; segments?: Array<{ segmentIndicator: number; origin: { iataCode: string }; destination: { iataCode: string }; airline: { code: string; flightNumber: string; fareClass: string } }> };
  const request = {
    itineraryId: state.selectedFlightId, traceId: state.bookingTraceId, journeyType: fareQuote.journeyType.toLowerCase(), isRoundTrip: fareQuote.journeyType.toUpperCase() === "ROUND_TRIP", isSpecialFlight: false,
    bookingForm: { email: passengerDetails.contact.email, phone: passengerDetails.contact.phone, countryCode: passengerDetails.contact.countryCode ?? "+91", whatsapp: true, isGstAvailable: false },
    bookingDetails: [{ journey: "onward", resultIndex: state.selectedFlightResultIndex, isLcc: Boolean(providerLeg.options?.isLcc), fareBrand: leg.fareBrand, fareType: providerLeg.options?.resultFareType ?? "RegularFare", refundable: leg.refundable, segments: (providerLeg.segments ?? []).map((segment) => ({ segmentIndicator: segment.segmentIndicator, origin: segment.origin.iataCode, destination: segment.destination.iataCode, airlineCode: segment.airline.code, flightNumber: segment.airline.flightNumber, fareClass: segment.airline.fareClass })), passengers: passengerDetails.passengers.map((passenger, index) => ({ clientPassengerId: `${passenger.type.toLowerCase()}-${index}`, passengerType: typeMap[passenger.type], title: passenger.gender === "FEMALE" ? "Ms" : "Mr", firstName: passenger.firstName, lastName: passenger.lastName, gender: passenger.gender === "FEMALE" ? "Female" : "Male", nationality: passengerDetails.contact.countryName ?? "Indian", countryCode: passengerDetails.contact.countryCode ?? "+91", countryName: passengerDetails.contact.countryName ?? "India", specialAssistance: false, ssr: selections.find((item) => item.clientPassengerId === `${passenger.type.toLowerCase()}-${index}`) ?? { seats: [], meals: [], baggage: [], specialServices: [] } })) }],
    clientPricing: { currency: fareQuote.fare.currency, amount: fareQuote.fare.totals.grandTotal },
  };
  try { const bookingPrepare = await prepareBooking(request); return { bookingPrepare, bookingStep: "BOOKING_PREPARED", assistantMessage: "Your booking is ready for final review.", error: undefined }; } catch (error) { return { error: error instanceof Error ? error.message : "Booking prepare failed.", assistantMessage: "Unable to prepare your booking." }; }
};
