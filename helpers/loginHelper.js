import { expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../constants.js";
import { findVerCode } from "./inboxHelper.js";
import loginPageElements from "../pageElements/loginPage.json" assert { type: "json" };

export const login = async (
  page,
  { email = userId, password = userSecretKey } = {},
) => {
  await page.goto(baseUrl);

  const acceptCookies = page.locator(loginPageElements.acceptCookiesButton);
  if (await acceptCookies.isVisible()) {
    await acceptCookies.click();
  }

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

  await verifCodeInput.fill(code);
  await continueButton.click();
};

export const submitCodeWithRetry = async (page, context, maxAttempts = 5) => {
  for (let i = 1; i < maxAttempts; i++) {
    const verifCode = await findVerCode(page, context);
    await registerDeviceForlogin(page, verifCode);

    const frame = page.frameLocator(loginPageElements.iframe);
    if (await frame.isVisible()) {
      const errorMessage = frame.locator(loginPageElements.errorMessage);
      if (!(await errorMessage.isVisible())) return;
    }
  }
};

export const loginWithVerifCode = async (page, context) => {
  const frame = await login(page);
  await expect(
    frame.locator(loginPageElements.verificationCodeInput),
  ).toBeVisible({
    timeout: 10000,
  });

  await submitCodeWithRetry(page, context);

  await expect(page.locator(loginPageElements.logoutButton)).toBeVisible();
};
