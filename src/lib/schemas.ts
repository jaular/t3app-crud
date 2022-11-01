import { z } from "zod";

const documentIdRegex = /^\d{7,8}$/;
const phoneNumberRegex =
  /^\+?\d{1,4}?[-.\s]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
// https://www.abstractapi.com/guides/validate-phone-number-javascript
// https://uibakery.io/regex-library/phone-number

export const patientSchema = z.object({
  documentId: z
    .string()
    .regex(documentIdRegex, { message: "Invalid document id" })
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
  birthDate: z.date(),
  gender: z.string().min(2, { message: "Pick one gender" }).trim(),
  adress: z.string().min(2).max(250).or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, { message: "Invalid phone number" })
    .or(z.literal("")),
  occupation: z.string().or(z.literal("")),
  habits: z.string().array().optional(), // string[] | undefined
});
