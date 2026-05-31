import { test, expect } from "@playwright/test";

test("cv list page shows heading", async ({ page }) => {
  await page.goto("/cv-list");
  await expect(page.getByRole("heading", { name: "My resumes" })).toBeVisible();
});
