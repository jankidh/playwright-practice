import { expect } from "@playwright/test";
import { inboxUrl } from "../constants.js";

export const findVerCode = async (page, context) => {
  //open new tab with malinator
  const [inboxPage] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate((url) => window.open(url, "_blank"), inboxUrl),
  ]);
  await inboxPage.waitForLoadState();
  await inboxPage.bringToFront();

  await expect(inboxPage).toHaveTitle("Mailinator");

  // finding the last email
  const verifCodeEmail = inboxPage.locator(
    "//tr[1]/td[3][contains(.,'Verification code')]",
  );
  await verifCodeEmail.isVisible();

  // Click the email opens a NEW page
  const emailPage = await Promise.all([
    inboxPage.waitForURL(
      (url) => url.searchParams.has("msgid") && !url.searchParams.has("to"),
      { waitUntil: "domcontentloaded" },
    ),
    verifCodeEmail.click(),
  ]).then(() => inboxPage);

  // Access the iframe containing the email body
  const frame = emailPage.frameLocator("#html_msg_body");
  const codeLocator = frame.locator("//table[3]/tbody/tr/td[contains(.,' ')]");

  await codeLocator.scrollIntoViewIfNeeded();

  const code = await codeLocator.textContent();
  await inboxPage.close();
  await page.bringToFront();
  return code;
};
