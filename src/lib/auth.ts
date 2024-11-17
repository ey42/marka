import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/drizzle/index";
import* as schema from "@/drizzle/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: {
            ...schema
        }
        
}),
    socialProviders: {
        google:{
            clientSecret:process.env.GOOGLE_SECRET!,
            clientId: process.env.GOOGLE_CLIENT!,

        }
    }
})