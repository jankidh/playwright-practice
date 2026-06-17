import { test, expect } from "@playwright/test";
import { signupWithVerifCode } from "../helpers/signupHelper.js";

test("Successfull signup with verification code", async ({ page, context }) => {
  await signupWithVerifCode(page, context);
});
