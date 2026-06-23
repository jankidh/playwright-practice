import { test, expect } from "@playwright/test";
import {
  getNewUserEmail,
  getUrlWithNewUserId,
} from "../helpers/mailinator/userHelper.js";

test("Successfull signup with verification code", () => {
  // await signupWithVerifCode(page, context);

  const email = getNewUserEmail();
  const url = getUrlWithNewUserId(email);
  console.log(url);
});
