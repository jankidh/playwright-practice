import { expect } from "@playwright/test";
import { inboxUrl } from "../constants.js";
import inboxPageElements from "../pageElements/inboxPage.json" assert { type: "json" };

export const findVerCode = async (page, context) => {
  //open new tab with malinator
  const [inboxPage] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate((url) => window.open(url, "_blank"), inboxUrl),
  ]);
  await inboxPage.waitForLoadState();
  await inboxPage.bringToFront();

  await expect(inboxPage).toHaveTitle("Mailinator");

  //finding the last email
  const verifCodeEmail = inboxPage.locator(
    inboxPageElements.latestVerificationEmail,
  );
  await verifCodeEmail.isVisible();

  //click the email opens a new page
  const emailPage = await Promise.all([
    inboxPage.waitForURL(
      (url) => url.searchParams.has("msgid") && !url.searchParams.has("to"),
      { waitUntil: "domcontentloaded" },
    ),
    verifCodeEmail.click(),
  ]).then(() => inboxPage);

  //access the iframe containing the email body
  const frame = emailPage.frameLocator(inboxPageElements.iframe);
  const codeLocator = frame.locator(inboxPageElements.verificationCode);

  await codeLocator.scrollIntoViewIfNeeded();

  const code = await codeLocator.textContent();
  await inboxPage.close();
  await page.bringToFront();
  return code.trim();
};
