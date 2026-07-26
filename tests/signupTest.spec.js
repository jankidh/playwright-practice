import { test, expect } from "@playwright/test";
import { signupWithVerifCode } from "../helpers/app/signup.js";
import { signUp } from "../helpers/app/signup.js";

test("Empty email address validation", async ({ page }) => {
  const frame = await signUp(page, { email: "" });
  const errorMessage = frame.getByText("Email address is required");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
});

test("Empty password validation", async ({ page }) => {
  const frame = await signUp(page, { password: "" });
  const errorMessage = frame.getByText("Password is required");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
});

test("Successful signup with verification code", async ({ page, context }) => {
  await signupWithVerifCode(page, context);
});
