import { test } from "@playwright/test";
import { signupWithVerifCode } from "../helpers/signupHelper.js";

test("Successful signup with verification code", async ({ page, context }) => {
  await signupWithVerifCode(page, context);
});
