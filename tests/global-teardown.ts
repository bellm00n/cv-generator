import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { TEST_USER_EMAIL } from "./global-setup";

dotenv.config({ path: ".env.test" });

export default async function globalTeardown() {
  if (!process.env.DATABASE_URL) return;
  const sql = neon(process.env.DATABASE_URL);
  try {
    // Cascade on User -> Cv / Account is configured in prisma/schema.prisma,
    // so related rows are cleaned up automatically.
    await sql`DELETE FROM "User" WHERE email = ${TEST_USER_EMAIL}`;
  } catch {
    // ignore — user may not exist if setup failed
  }
}
