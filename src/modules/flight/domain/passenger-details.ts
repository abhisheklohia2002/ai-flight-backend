import {
  z,
} from "zod";

export const PassengerTypeSchema =
  z.enum([
    "ADULT",
    "CHILD",
    "INFANT",
  ]);

export const GenderSchema =
  z.enum([
    "MALE",
    "FEMALE",
  ]);

export const PassengerSchema =
  z.object({
    type:
      PassengerTypeSchema,

    firstName:
      z.string()
        .trim()
        .max(100),

    lastName:
      z.string()
        .trim()
        .max(100),

    gender:
      GenderSchema
        .optional(),

    dateOfBirth:
      z.string()
        .trim()
        .optional(),

    pan:
      z.string()
        .trim()
        .optional(),

    passport:
      z.object({
        number:
          z.string()
            .trim()
            .optional(),

        expiryDate:
          z.string()
            .trim()
            .optional(),

        issueDate:
          z.string()
            .trim()
            .optional(),

        issuingCountry:
          z.string()
            .trim()
            .optional(),
      })
      .optional(),
  });

export const ContactDetailsSchema =
  z.object({
    email:
      z.string()
        .trim()
        .email()
        .optional(),

    phone:
      z.string()
        .trim()
        .optional(),

    countryCode:
      z.string()
        .trim()
        .optional(),

    countryName:
      z.string()
        .trim()
        .optional(),

    address:
      z.string()
        .trim()
        .optional(),
  });

export const PassengerDetailsSchema =
  z.object({
    passengers:
      z.array(
        PassengerSchema
      )
      .min(1),

    contact:
      ContactDetailsSchema,
  });

export type PassengerDetails =
  z.infer<
    typeof PassengerDetailsSchema
  >;