import { z } from "zod";

export const FareQuoteSchema =
  z.object({
    traceId:
      z.string(),

    journeyType:
      z.string(),

    quoteStatus:
      z.object({
        isPriceChanged:
          z.boolean(),

        isTimeChanged:
          z.boolean(),

        changeInfo:
          z.unknown()
            .nullable()
            .optional(),
      }),

   validators:
  z.object({
    name:
      z.object({
        firstNameRequired:
          z.boolean(),

        lastNameRequired:
          z.boolean(),

        isLastNameSpaceRestricted:
          z.boolean(),

        uniquePassengerNamesRequired:
          z.boolean(),

        firstNameFormat:
          z.string(),

        lastNameFormat:
          z.string(),
      }),

    ssr:
      z.object({
        isMealRequired:
          z.boolean(),

        isSeatRequired:
          z.boolean(),
      }),

    gender:
      z.object({
        required:
          z.boolean(),
      }),

    dateOfBirth:
      z.object({
        adultRequired:
          z.boolean(),

        childRequired:
          z.boolean(),

        infantRequired:
          z.boolean(),
      }),

    contact:
      z.object({
        emailRequired:
          z.boolean(),

        phoneRequired:
          z.boolean(),

        countryCodeRequired:
          z.boolean(),

        countryNameRequired:
          z.boolean(),

        addressRequired:
          z.boolean(),
      }),

    pan:
      z.object({
        requiredAtBook:
          z.boolean(),

        requiredAtTicket:
          z.boolean(),
      }),

    passport:
      z.object({
        requiredAtBook:
          z.boolean(),

        requiredAtTicket:
          z.boolean(),

        fullDetailRequiredAtBook:
          z.boolean(),

        expiryRequired:
          z.boolean(),

        issueDateRequired:
          z.boolean(),

        issuingCountryRequired:
          z.boolean(),

        minimumValidityMonths:
          z.number(),
      }),

    gst:
      z.object({
        allowed:
          z.boolean(),

        mandatory:
          z.boolean(),

        customerDetailsAllowed:
          z.boolean(),
      }),

    specialFare:
      z.object({
        type:
          z.string(),

        documentRequired:
          z.boolean(),

        documentType:
          z.string()
            .nullable(),

        minimumAge:
          z.number()
            .nullable(),

        note:
          z.string()
            .nullable(),
      }),

    booking:
      z.object({
        isBookableIfSeatNotAvailable:
          z.boolean(),

        isHoldAllowed:
          z.boolean(),

        isHoldAllowedWithSsr:
          z.boolean(),

        isHoldMandatoryWithSsr:
          z.boolean(),
      }),
  }),

    legs:
      z.array(
        z.object({
          resultId:
            z.string(),

          journey:
            z.string(),

          legIndicator:
            z.number()
              .optional(),

          cabinClass:
            z.string(),

          airline:
            z.object({
              code:
                z.string(),

              name:
                z.string(),

              logo:
                z.string()
                  .nullable()
                  .optional(),

              businessModel:
                z.string()
                  .optional(),
            }),

          flightNumber:
            z.string(),

          origin:
            z.record(
              z.string(),
              z.unknown()
            ),

          destination:
            z.record(
              z.string(),
              z.unknown()
            ),

          departTime:
            z.string(),

          arrivalTime:
            z.string(),

          durationMinutes:
            z.number(),

          stops:
            z.number(),

          aircraft:
            z.string()
              .optional(),

          fareBrand:
            z.string()
              .optional(),

          refundable:
            z.boolean(),

          totalFare:
            z.number(),

          baggage:
            z.object({
              cabin:
                z.string()
                  .optional(),

              checkIn:
                z.string()
                  .optional(),
            })
            .optional(),
        })
        .passthrough()
      ),

    fare:
      z.object({
        currency:
          z.string(),

        passengerBreakdown:
          z.array(
            z.object({
              type:
                z.string(),

              count:
                z.number(),

              baseFare:
                z.number(),

              taxesAndSurcharges:
                z.number(),

              publishFare:
                z.number(),

              discount:
                z.number(),

              txlFee:
                z.number()
                  .optional(),

              totalFare:
                z.number(),
            })
            .passthrough()
          ),

        totals:
          z.object({
            baseFare:
              z.number(),

            taxesAndSurcharges:
              z.number(),

            publishFare:
              z.number(),

            discount:
              z.number(),

            supplierTotal:
              z.number(),

            grandTotal:
              z.number(),
          }),

        txlFees:
          z.object({
            convenienceFee:
              z.number()
                .optional(),

            cfarAmount:
              z.number()
                .optional(),

            dcfarAmount:
              z.number()
                .optional(),
          })
          .optional(),
      }),
  })
  .passthrough();

export type FareQuote =
  z.infer<
    typeof FareQuoteSchema
  >;