// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { patientRouter } from "./patient";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("patient.", patientRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
