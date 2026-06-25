import { expect } from "@playwright/test";
import { baseUrl, userId, userSecretKey } from "../../constants.js";
import { findVerCode } from "../mailinator/inbox.js";
import loginModal from "../../pageElements/app/modal/login.json" assert { type: "json" };
import modalCommon from "../../pageElements/app/modal/common.json" assert { type: "json" };
import pageCommon from "../../pageElements/app/page/common.json" assert { type: "json" };

export const getLoginForm = async (page) => {
  await page.goto(baseUrl);

  const acceptCookies = page.locator(pageCommon.acceptCookiesButton);
  await page.addLocatorHandler(acceptCookies, async () => {
    await acceptCookies.click();
  });

  await page.locator(pageCommon.loginButton).click();

  const frame = page.frameLocator(pageCommon.iframe);
  return frame;
};

export const login = async (
  page,
  { email = userId, password = userSecretKey } = {},
) => {
  const frame = await getLoginForm(page);

  const emailInput = frame.locator(loginModal.emailInput);
  const passwordInput = frame.locator(loginModal.passwordInput);
  const submitButton = frame.locator(loginModal.submitButton);

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();

  return frame;
};

export const submitVerificationCode = async (page, code) => {
  const frame = page.frameLocator(pageCommon.iframe);

  const verifCodeInput = frame.locator(modalCommon.verificationCodeInput);
  const continueButton = frame.locator(modalCommon.continueButton);
  const errorMessage = frame.locator(modalCommon.errorMessage);

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
  await expect(frame.locator(modalCommon.verificationCodeInput)).toBeVisible({
    timeout: 10000,
  });

  await completeVerification(page, context);

  await expect(page.locator(pageCommon.logoutButton)).toBeVisible();
};
