import { expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../constants.js";
import { findVerCode } from "./inboxHelper.js";

export const login = async (
  page,
  { email = userId, password = userSecretKey } = {},
) => {
  await page.goto(baseUrl);
  await expect(page).toHaveTitle(
    "Official Ryanair website | Book direct for the lowest fares | Ryanair.com",
  );

  const acceptCookies = page.getByRole("button", { name: "Yes, I agree" });
  await acceptCookies.click().catch(() => {});

  await page.locator("ry-log-in-button").click();

  const frame = page.frameLocator('iframe[data-ref="kyc-iframe"]');

  const emailInput = frame.locator('input[name="email"]');
  const passwordInput = frame.locator('input[name="password"]');
  const submitButton = frame.locator('button[type="submit"]');

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();

  return frame;
};

export const registerDeviceForlogin = async (page, code) => {
  const frame = page.frameLocator('iframe[data-ref="kyc-iframe"]');

  const verifCodeInput = frame.locator('input[type="text"]');
  const continueButton = frame.locator(
    'button[data-ref="email-verification-continue"]',
  );

  await verifCodeInput.fill(code);
  await continueButton.click();
};

export const loginWithVerifCode = async (page, context) => {
  const frame = await login(page);
  await expect(frame.locator('input[type="text"]')).toBeVisible({
    timeout: 10000,
  });
  const verifCode = await findVerCode(page, context);
  await registerDeviceForlogin(page, verifCode);
  await expect(
    page.locator('//header//button[contains(@class, "log-out")]'),
  ).toBeVisible();
};
