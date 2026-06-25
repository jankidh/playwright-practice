import { expect } from "@playwright/test";
import { userSecretKey } from "../constants.js";
import { getLoginForm, completeVerification } from "./login.js";
import signupPopup from "../pageElements/app/signupPopup.json" assert { type: "json" };
import common from "../pageElements/app/common.json" assert { type: "json" };
import { getNewUserEmail, logNewAccount } from "./mailinator/newUsers.js";

export const getSignupForm = async (page) => {
  const frame = await getLoginForm(page);

  await frame.locator(signupPopup.signupLink).click();

  await expect(frame.locator(signupPopup.createAccountButton)).toBeVisible();

  return frame;
};

export const signUp = async (
  page,
  { email = getNewUserEmail(), password = userSecretKey } = {},
) => {
  const frame = await getSignupForm(page);

  const emailInput = frame.locator(signupPopup.emailInput);
  const passwordInput = frame.locator(signupPopup.passwordInput);
  const createAccountButton = frame.locator(signupPopup.createAccountButton);

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await createAccountButton.click();

  return frame;
};

export const signupWithVerifCode = async (page, context) => {
  const email = getNewUserEmail();
  const frame = await signUp(page, { email });

  await expect(frame.locator(common.verificationCodeInput)).toBeVisible({
    timeout: 10000,
  });

  await completeVerification(page, context, true, email);

  await expect(page.locator(common.logoutButton)).toBeVisible();

  await logNewAccount(email);
};
