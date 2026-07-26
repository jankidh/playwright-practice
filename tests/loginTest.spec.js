import { test, expect } from "@playwright/test";
import { login, loginWithVerifCode } from "../helpers/app/login.js";

test("Empty email address validation", async ({ page }) => {
  const frame = await login(page, { email: "" });
  const errorMessage = frame.getByText("Email address is required");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
});

test("Empty password validation", async ({ page }) => {
  const frame = await login(page, { password: "" });
  const errorMessage = frame.getByText("Password is required");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
});

test("Invalid credential", async ({ page }) => {
  const frame = await login(page, {
    email: "testing@gmail.com",
    password: "abcd123",
  });
  const errorMessage = frame.getByText("Incorrect email address or password");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
});

test("Successful login with verification code", async ({ page, context }) => {
  await loginWithVerifCode(page, context);
});
