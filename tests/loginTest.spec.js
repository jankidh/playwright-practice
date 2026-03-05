import { test, expect } from "@playwright/test";
import { login } from "../helpers/loginHelper";

test("User can successfully login", async ({ page }) => {
  await login(page);
});
