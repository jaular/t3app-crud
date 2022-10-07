import { z } from "zod";

export const patientSchema = z.object({
  documentId: z
    .string()
    .min(7, { message: "Document ID should have at least 7 letters" })
    .max(8, { message: "Max 8 letters" })
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
  gender: z.string().min(2, { message: "Pick one gender" }).trim(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
});
