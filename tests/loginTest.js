// @ts-check
import { test, expect } from "@playwright/test";

test("get started link", async ({ page }) => {
  await page.goto("https://www.ryanair.com/gb/en");
  await expect(page).toHaveTitle(
    "Official Ryanair website | Book direct for the lowest fares | Ryanair.com",
  );

  const acceptCookies = page.locator('button:has-text("Yes, I agree")');
  if (await acceptCookies.isVisible({ timeout: 5000 })) {
    await acceptCookies.click();
  }

  await page.locator("ry-log-in-button").click();

  console.log(await page.locator("iframe").count());

  // await expect(page.getByText("Log into myRyanair")).toBeVisible();

  // const emailInput = page.locator('//input[@name="email"]');
  // await emailInput.waitFor({ state: "visible", timeout: 10000 });

  // await emailInput.fill("janki.dholariya@gmail.com");
  // await page.locator('//input[@name="password"]').fill("Janu@0211");

  // await page.pause();
});
