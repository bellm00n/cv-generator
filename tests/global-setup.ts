import * as fs from "fs";
import * as dotenv from "dotenv";
import { chromium } from "@playwright/test";
import { encode } from "next-auth/jwt";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.test" });

export const TEST_USER_EMAIL = "e2e-test@example.com";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Make sure .env.test exists locally or the secret is set in CI.`,
    );
  }
  return value;
}

export default async function globalSetup() {
  const sql = neon(requireEnv("DATABASE_URL"));
  const authSecret = requireEnv("AUTH_SECRET");

  const rows = await sql`
    INSERT INTO "User" (id, email, name)
    VALUES (gen_random_uuid()::text, ${TEST_USER_EMAIL}, 'E2E Test User')
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, email, name
  `;
  const user = rows[0];

  // salt must match the NextAuth session cookie name (authjs.session-token).
  const sessionToken = await encode({
    token: { sub: user.id, email: user.email, name: user.name },
    secret: authSecret,
    salt: "authjs.session-token",
  });

  fs.mkdirSync("tests/.auth", { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await context.storageState({ path: "tests/.auth/user.json" });
  await browser.close();
}
