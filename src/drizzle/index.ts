import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "@/drizzle/db/schema"

    // Disable prefetch as it is not supported for "Transaction" pool mode 
    const client = postgres(process.env.DATABASE_URL_LOCAL!)
    export const db = drizzle(client,{schema});
