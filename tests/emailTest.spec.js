// import { test, expect } from "@playwright/test";
// import { inboxUrl } from "../constants.js";

// test("get started link", async ({ page }) => {
//   await page.goto(inboxUrl);
//   await expect(page).toHaveTitle("Mailinator");

//   const verifCodeEmail = page.locator(
//     "//tr[1]/td[3][contains(.,'Verification code')]",
//   );
//   await verifCodeEmail.isVisible();
//   await verifCodeEmail.click();

//   const codeLocator = page.locator(
//     "//center/table/tbody/tr/td/table[3]/tbody/tr/td[contains(.,' ')]",
//   );
//   const code = await codeLocator.textContent();
//   console.log(code);

//   // await page.pause();
// });

// // /html/body/center/table/tbody/tr/td/table[4]/tbody/tr/td/table/tbody/tr/td[2]/center/table/tbody/tr/td/table[3]/tbody/tr/td
// //body > center > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > center > table > tbody > tr > td > table:nth-child(5) > tbody > tr > td
