import { expect } from "@playwright/test";
import { getLoginForm, completeVerification } from "./login.js";
import { getNewUserEmail, logNewAccount } from "../mailinator/newUsers.js";
import { userSecretKey } from "../../constants.js";
import loginModal from "../../pageElements/app/modal/login.json" assert { type: "json" };
import modalCommon from "../../pageElements/app/modal/common.json" assert { type: "json" };
import signupModal from "../../pageElements/app/modal/signup.json" assert { type: "json" };
import pageCommon from "../../pageElements/app/page/common.json" assert { type: "json" };

export const getSignupForm = async (page) => {
  const frame = await getLoginForm(page);

  await frame.locator(loginModal.signupLink).click();

  await expect(frame.locator(signupModal.createAccountButton)).toBeVisible();

  return frame;
};

export const signUp = async (
  page,
  { email = getNewUserEmail(), password = userSecretKey } = {},
) => {
  const frame = await getSignupForm(page);

  const emailInput = frame.locator(modalCommon.emailInput);
  const passwordInput = frame.locator(modalCommon.passwordInput);
  const createAccountButton = frame.locator(signupModal.createAccountButton);

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await createAccountButton.click();

  return frame;
};

export const signupWithVerifCode = async (page, context) => {
  const email = getNewUserEmail();
  const frame = await signUp(page, { email });

  await expect(frame.locator(modalCommon.verificationCodeInput)).toBeVisible({
    timeout: 10000,
  });

  await completeVerification(page, context, true, email);

  await expect(page.locator(pageCommon.logoutButton)).toBeVisible();

  await logNewAccount(email);
};
