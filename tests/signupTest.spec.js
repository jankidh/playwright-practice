import { test } from "@playwright/test";
import { signupWithVerifCode } from "../helpers/signup.js";

test("Successful signup with verification code", async ({ page, context }) => {
  await signupWithVerifCode(page, context);
});
