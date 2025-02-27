import {  router } from "./trpc";
import { DatabaseRouter } from "./routes/database";

export const appRouter = router({
   database: DatabaseRouter
})

export type AppRouter = typeof appRouter