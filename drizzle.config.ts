import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './src/drizzle',
  schema: './src/drizzle/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NODE_ENV === "production" ? process.env.DATABASE_URL! : process.env.DATABASE_URL_LOCAL!
  },
});