// @ts-nocheck
import { test, expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../constants.js";

test("get started link", async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page).toHaveTitle(
    "Official Ryanair website | Book direct for the lowest fares | Ryanair.com",
  );

  const acceptCookies = page.locator('button:has-text("Yes, I agree")');
  if (await acceptCookies.isVisible({ timeout: 5000 })) {
    await acceptCookies.click();
  }

  await page.locator("ry-log-in-button").click();

  const frameLocator = page.frameLocator('iframe[data-ref="kyc-iframe"]');

  await frameLocator.locator('input[name="email"]').fill(userId);
  await frameLocator.locator('input[name="password"]').fill(userSecretKey);
  await frameLocator.locator('button[type="submit"]').click();

  await page.pause();
});
