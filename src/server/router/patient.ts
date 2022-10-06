import { Prisma } from "@prisma/client";
import { createRouter } from "./context";
import { z } from "zod";

const defaultPatientSelect = Prisma.validator<Prisma.PatientSelect>()({
  id: true,
  documentId: true,
  firstName: true,
  lastName: true,
  gender: true,
  createdAt: true,
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
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      const patient = await ctx.prisma.patient.findUnique({
        where: { id },
        select: defaultPatientSelect,
      });
      return patient;
    },
  })
  // Create patient
  .mutation("create", {
    input: z.object({
      documentId: z.string().min(7).max(8),
      firstName: z.string().min(1).max(30),
      lastName: z.string().min(1).max(30),
      gender: z.string().min(1).max(30),
    }),
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
    input: z.object({
      id: z.string(),
      documentId: z.string().min(7).max(8),
      firstName: z.string().min(1).max(32),
      lastName: z.string().min(1).max(32),
      gender: z.string().min(1).max(30),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      const patient = await ctx.prisma.patient.update({
        where: { id },
        data: input,
      });
      return patient;
    },
  })
  // Delete patient
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      await ctx.prisma.patient.delete({
        where: { id },
      });
    },
  });
