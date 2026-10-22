import type {
  PassengerDetails,
} from "../../modules/flight/domain/passenger-details.js";
import { FlightAssistantState } from "../graph/state.js";

import type {
  FareQuote,
} from "../schemas/fare-quote.schema.js";
import { getSsrOptions } from "../../modules/flight/infrastructure/providers/tripxl/tripxl-ssr.provider.js";


interface ValidateArgs {
  details:
    PassengerDetails;

  fareQuote:
    FareQuote;
}


function validatePassengerDetails({
  details,
  fareQuote,
}: ValidateArgs):
  string[] {

  const errors:
    string[] = [];

  const validators =
    fareQuote.validators;


  /*
   * --------------------------------
   * Passenger count/type validation
   * --------------------------------
   */

  const expectedCounts =
    new Map<
      string,
      number
    >();

  for (
    const item of
    fareQuote.fare
      .passengerBreakdown
  ) {

    expectedCounts.set(
      item.type
        .toUpperCase(),

      item.count
    );
  }


  for (
    const [
      type,
      expectedCount,
    ] of expectedCounts
  ) {

    const actualCount =
      details.passengers.filter(
        passenger =>
          passenger.type ===
          type
      ).length;


    if (
      actualCount !==
      expectedCount
    ) {

      errors.push(
        `Expected ${expectedCount} ${type.toLowerCase()} passenger(s), received ${actualCount}.`
      );
    }
  }


  /*
   * --------------------------------
   * Passenger validators
   * --------------------------------
   */

  for (
    const [
      index,
      passenger,
    ] of
    details.passengers.entries()
  ) {

    const passengerLabel =
      `Passenger ${index + 1}`;


    if (
      validators.name
        .firstNameRequired &&
      !passenger.firstName
        .trim()
    ) {

      errors.push(
        `${passengerLabel}: first name is required.`
      );
    }


    if (
      validators.name
        .lastNameRequired &&
      !passenger.lastName
        .trim()
    ) {

      errors.push(
        `${passengerLabel}: last name is required.`
      );
    }


    if (
      validators.name
        .isLastNameSpaceRestricted &&
      passenger.lastName
        .includes(" ")
    ) {

      errors.push(
        `${passengerLabel}: last name cannot contain spaces.`
      );
    }


    if (
      validators.gender
        .required &&
      !passenger.gender
    ) {

      errors.push(
        `${passengerLabel}: gender is required.`
      );
    }


    const dobRequired =
      passenger.type ===
        "ADULT"
        ? validators
            .dateOfBirth
            .adultRequired

        : passenger.type ===
            "CHILD"
          ? validators
              .dateOfBirth
              .childRequired

          : validators
              .dateOfBirth
              .infantRequired;


    if (
      dobRequired &&
      !passenger.dateOfBirth
    ) {

      errors.push(
        `${passengerLabel}: date of birth is required.`
      );
    }


    if (
      validators.pan
        .requiredAtBook &&
      !passenger.pan
    ) {

      errors.push(
        `${passengerLabel}: PAN is required.`
      );
    }


    if (
      validators.passport
        .requiredAtBook &&
      !passenger.passport
        ?.number
    ) {

      errors.push(
        `${passengerLabel}: passport number is required.`
      );
    }
  }


  /*
   * --------------------------------
   * Unique passenger names
   * --------------------------------
   */

  if (
    validators.name
      .uniquePassengerNamesRequired
  ) {

    const names =
      details.passengers.map(
        passenger =>
          `${passenger.firstName.trim().toLowerCase()}::${passenger.lastName.trim().toLowerCase()}`
      );


    if (
      new Set(
        names
      ).size !==
      names.length
    ) {

      errors.push(
        "Passenger names must be unique."
      );
    }
  }


  /*
   * --------------------------------
   * Contact validation
   * --------------------------------
   */

  const contact =
    details.contact;


  if (
    validators.contact
      .emailRequired &&
    !contact.email
  ) {

    errors.push(
      "Email is required."
    );
  }


  if (
    validators.contact
      .phoneRequired &&
    !contact.phone
  ) {

    errors.push(
      "Phone number is required."
    );
  }


  if (
    validators.contact
      .countryCodeRequired &&
    !contact.countryCode
  ) {

    errors.push(
      "Country code is required."
    );
  }


  if (
    validators.contact
      .countryNameRequired &&
    !contact.countryName
  ) {

    errors.push(
      "Country name is required."
    );
  }


  if (
    validators.contact
      .addressRequired &&
    !contact.address
  ) {

    errors.push(
      "Address is required."
    );
  }


  return errors;
}




  export async function submitPassengerDetailsNode(
  state:
    typeof FlightAssistantState.State
) {

  if (
    !state.fareQuote
  ) {

    return {
      error:
        "FARE_QUOTE_REQUIRED",

      assistantMessage:
        "Please confirm the fare before entering passenger details.",
    };
  }


  if (
    !state.requestedPassengerDetails
  ) {

    return {
      error:
        "PASSENGER_DETAILS_REQUIRED",

      assistantMessage:
        "Passenger details are required.",
    };
  }


  const errors =
    validatePassengerDetails({
      details:
        state.requestedPassengerDetails,

      fareQuote:
        state.fareQuote,
    });


  if (
    errors.length >
    0
  ) {

    return {
      validationErrors:
        errors,

      assistantMessage:
        errors[0],
    };
  }


  const itineraryId = state.selectedFlightId;
  const resultIndex = state.selectedFlightResultIndex;
  const traceId = state.bookingTraceId ?? state.traceId;
  if (!itineraryId || !resultIndex || !traceId) return { error: "SSR_CONTEXT_REQUIRED", assistantMessage: "Your flight search context is no longer available. Please search again." };
  try {
    const ssrOptions = await getSsrOptions({ traceId, itineraryId, resultIndex });
    return { passengerDetails: state.requestedPassengerDetails, requestedPassengerDetails: undefined, ssrOptions, bookingStep: "PASSENGER_DETAILS_COMPLETE", validationErrors: [], assistantMessage: "Passenger details are saved. Select your available flight services." };
  } catch (error) { return { error: error instanceof Error ? error.message : "SSR options failed.", assistantMessage: "Unable to load flight service options." }; }
}
