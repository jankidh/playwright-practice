import { test, expect } from "@playwright/test";
import { login, loginWithVerifCode } from "../helpers/loginHelper.js";

test("Empty email address validation", async ({ page }) => {
  const frame = await login(page, { email: "" });
  const errorMessage = frame.locator("text=Email address is required");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
});

test("Empty password  validation", async ({ page }) => {
  const frame = await login(page, { password: "" });
  const errorMessage = frame.locator("span._error");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText("Password is required");
});

test("Invalid credential", async ({ page }) => {
  const frame = await login(page, {
    email: "testing@gmail.com",
    password: "abcd123",
  });
  const errorMessage = frame.locator("span._error");

  await errorMessage.waitFor({ state: "visible" });
  await expect(errorMessage).toContainText(
    "Incorrect email address or password",
  );
});

test("Successfull login with verification code", async ({ page, context }) => {
  await loginWithVerifCode(page, context);
});
