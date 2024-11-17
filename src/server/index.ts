import { Catagoryprops } from "@/app/page";
import { publicProcedure, router } from "./trpc";
import { db } from '@/drizzle'
import * as schema from "@/drizzle/db/schema"
import { z } from "zod";
import * as uuid from 'uuid';
import { TRPCError } from "@trpc/server";
import { DatabaseRouter } from "./routes/database";

export const appRouter = router({
   database: DatabaseRouter
})

export type AppRouter = typeof appRouter