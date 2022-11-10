import { z } from "zod";

const documentIdRegex = /^\d{7,8}$/;
const phoneNumberRegex =
  /^\+?\d{1,4}?[-.\s]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
// https://www.abstractapi.com/guides/validate-phone-number-javascript
// https://uibakery.io/regex-library/phone-number

export const patientSchema = z.object({
  documentId: z
    .string()
    .regex(documentIdRegex, {
      message: "Invalid document id, should have at least 7-8 numbers",
    })
    .trim(),
  firstName: z
    .string()
    .min(2, { message: "First name should have at least 2 letters" })
    .max(30, { message: "Max 30 letters" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name should have at least 2 letters" })
    .max(30, { message: "Max 30 letters" })
    .trim(),
  birthDate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  gender: z.string().min(2, { message: "Pick one gender" }).trim(),
  address: z
    .string()
    .min(2, { message: "Address should have at least 2 letters" })
    .max(250, { message: "Max 250 letters" })
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, { message: "Invalid phone number" })
    .or(z.literal("")),
  occupation: z
    .string()
    .min(2, { message: "Occupation should have at least 2 letters" })
    .max(250, { message: "Max 250 letters" })
    .or(z.literal("")),
  habits: z.string().array().optional(), // string[] | undefined
  personalMedicalHistory: z.string().array().optional(),
});
