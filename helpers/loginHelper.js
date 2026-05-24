import { expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../constants.js";
import { findVerCode } from "./inboxHelper.js";
import loginPageElements from "../pageElements/app/loginPage.json" assert { type: "json" };

export const login = async (
  page,
  { email = userId, password = userSecretKey } = {},
) => {
  await page.goto(baseUrl);

  const acceptCookies = page.locator(loginPageElements.acceptCookiesButton);
  await page.addLocatorHandler(acceptCookies, async () => {
    await acceptCookies.click();
  });

  await page.locator(loginPageElements.loginButton).click();

  const frame = page.frameLocator(loginPageElements.iframe);

  const emailInput = frame.locator(loginPageElements.emailInput);
  const passwordInput = frame.locator(loginPageElements.passwordInput);
  const submitButton = frame.locator(loginPageElements.submitButton);

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();

  return frame;
};

export const registerDeviceForlogin = async (page, code) => {
  const frame = page.frameLocator(loginPageElements.iframe);

  const verifCodeInput = frame.locator(loginPageElements.verificationCodeInput);
  const continueButton = frame.locator(loginPageElements.continueButton);
  const errorMessage = frame.locator(loginPageElements.errorMessage);

  await verifCodeInput.fill(code);
  await continueButton.click();

  const hasError = await errorMessage
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  return !hasError;
};

export const loginWithVerifCode = async (page, context) => {
  const frame = await login(page);
  await expect(frame.locator(loginPageElements.emailInput)).toBeVisible({
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
        throw new Error(
          `Fresh verification code not received after ${maxAttempts} attempts`,
        );
    }

    await registerDeviceForlogin(page, verifCode);
  }

  await expect(page.locator(loginPageElements.logoutButton)).toBeVisible();
};
