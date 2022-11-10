import { Prisma } from "@prisma/client";
import { createRouter } from "./context";
import { z } from "zod";
import { patientSchema } from "~/lib/schemas";

const defaultPatientSelect = Prisma.validator<Prisma.PatientSelect>()({
  documentId: true,
  firstName: true,
  lastName: true,
  birthDate: true,
  gender: true,
  address: true,
  email: true,
  phoneNumber: true,
  createdAt: true,
  occupation: true,
  habits: true,
  personalMedicalHistory: true,
});

export const patientRouter = createRouter()
  // Get all
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.patient.findMany({
        select: defaultPatientSelect,
        orderBy: { createdAt: "desc" },
      });
    },
  })
  // By id
  .query("byId", {
    input: z.object({
      documentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { documentId } = input;
      const patient = await ctx.prisma.patient.findUnique({
        where: { documentId },
        select: defaultPatientSelect,
      });
      return patient;
    },
  })
  // Create patient
  .mutation("create", {
    input: patientSchema,
    async resolve({ input, ctx }) {
      const patient = await ctx.prisma.patient.create({
        data: input,
        select: defaultPatientSelect,
      });
      return patient;
    },
  })
  // Edit patient
  .mutation("update", {
    input: patientSchema,
    async resolve({ input, ctx }) {
      const { documentId } = input;
      const patient = await ctx.prisma.patient.update({
        where: { documentId },
        data: input,
      });
      return patient;
    },
  })
  // Delete patient
  .mutation("delete", {
    input: z.object({
      documentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { documentId } = input;
      await ctx.prisma.patient.delete({
        where: { documentId },
      });
    },
  });
