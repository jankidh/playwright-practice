import { expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../constants.js";
import { findVerCode } from "./inboxHelper.js";

export const login = async (
  page,
  { email = userId, password = userSecretKey } = {},
) => {
  await page.goto(baseUrl);

  const acceptCookies = page.locator('button[data-ref="cookie.accept-all"]');
  await page.addLocatorHandler(acceptCookies, async () => {
    await acceptCookies.click();
  });

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
  const errorMessage = frame.locator("span._error");

  await verifCodeInput.fill(code.trim());
  await continueButton.click();

  const hasError = await errorMessage
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  return !hasError;
};

export const loginWithVerifCode = async (page, context) => {
  const frame = await login(page);
  await expect(frame.locator('input[type="text"]')).toBeVisible({
    timeout: 10000,
  });

  let verifCode = await findVerCode(page, context);
  const success = await registerDeviceForlogin(page, verifCode);

  if (!success) {
    const oldVerCode = verifCode;
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await page.waitForTimeout(30_000 * attempt);
      verifCode = await findVerCode(page, context);
      if (verifCode !== oldVerCode) break;
      if (attempt === maxAttempts)
        throw new Error(`Fresh verification code not received after ${maxAttempts} attempts`);
    }

    await registerDeviceForlogin(page, verifCode);
  }

  await expect(
    page.locator('//header//button[contains(@class, "log-out")]'),
  ).toBeVisible();
};
