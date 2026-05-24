import { expect } from "@playwright/test";
import { inboxUrl } from "../constants.js";
import inboxPageElements from "../pageElements/mailinator/inboxPage.json" assert { type: "json" };

const getLatestVerCode = async (inboxPage) => {
  const verifCodeEmail = inboxPage.locator(
    inboxPageElements.latestVerificationEmail,
  );
  await verifCodeEmail.isVisible();

  await Promise.all([
    inboxPage.waitForURL(
      (url) => url.searchParams.has("msgid") && !url.searchParams.has("to"),
      { waitUntil: "domcontentloaded" },
    ),
    verifCodeEmail.click(),
  ]);

  const frame = inboxPage.frameLocator(inboxPageElements.iframe);
  const codeLocator = frame.locator(inboxPageElements.verificationCode);
  await codeLocator.scrollIntoViewIfNeeded();
  return (await codeLocator.textContent()).trim();
};

export const findVerCode = async (page, context) => {
  const [inboxPage] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate((url) => window.open(url, "_blank"), inboxUrl),
  ]);
  await inboxPage.waitForLoadState();
  await inboxPage.bringToFront();

  await expect(inboxPage).toHaveTitle("Mailinator");

  const code = await getLatestVerCode(inboxPage);

  await inboxPage.close();
  await page.bringToFront();
  return code;
};
