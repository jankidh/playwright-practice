import { expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../constants.js";
import { findVerCode } from "./mailinator/inbox.js";
import loginPopup from "../pageElements/app/loginPopup.json" assert { type: "json" };
import common from "../pageElements/app/common.json" assert { type: "json" };

export const getLoginForm = async (page) => {
  await page.goto(baseUrl);

  const acceptCookies = page.locator(common.acceptCookiesButton);
  await page.addLocatorHandler(acceptCookies, async () => {
    await acceptCookies.click();
  });

  await page.locator(common.loginButton).click();

  const frame = page.frameLocator(common.iframe);
  return frame;
};

export const login = async (
  page,
  { email = userId, password = userSecretKey } = {},
) => {
  const frame = await getLoginForm(page);

  const emailInput = frame.locator(loginPopup.emailInput);
  const passwordInput = frame.locator(loginPopup.passwordInput);
  const submitButton = frame.locator(loginPopup.submitButton);

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();

  return frame;
};

export const submitVerificationCode = async (page, code) => {
  const frame = page.frameLocator(common.iframe);

  const verifCodeInput = frame.locator(common.verificationCodeInput);
  const continueButton = frame.locator(common.continueButton);
  const errorMessage = frame.locator(common.errorMessage);

  await verifCodeInput.fill(code);
  await continueButton.click();

  const hasError = await errorMessage
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  return !hasError;
};

export const completeVerification = async (
  page,
  context,
  isActivation,
  email,
) => {
  let verifCode = await findVerCode(page, context, isActivation, email);
  const success = await submitVerificationCode(page, verifCode);

  if (!success) {
    const oldVerCode = verifCode;
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await page.waitForTimeout(30_000 * attempt);
      verifCode = await findVerCode(page, context, isActivation, email);
      if (verifCode !== oldVerCode) break;
      if (attempt === maxAttempts)
        throw new Error(
          `Fresh verification code not received after ${maxAttempts} attempts`,
        );
    }

    await submitVerificationCode(page, verifCode);
  }
};

export const loginWithVerifCode = async (page, context) => {
  const frame = await login(page);
  await expect(frame.locator(common.verificationCodeInput)).toBeVisible({
    timeout: 10000,
  });

  await completeVerification(page, context);

  await expect(page.locator(common.logoutButton)).toBeVisible();
};
