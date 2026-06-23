import { expect } from "@playwright/test";
import { inboxUrl, inboxUrl } from "../../constants.js";
import inbox from "../../pageElements/mailinator/inboxPage.json" assert { type: "json" };

const getLatestVerCode = async (inboxPage, isActivation = false) => {
  const verifCodeEmail = inboxPage.locator(inbox.latestVerificationEmail);
  await verifCodeEmail.isVisible();

  await Promise.all([
    inboxPage.waitForURL(
      (url) => url.searchParams.has("msgid") && !url.searchParams.has("to"),
      { waitUntil: "domcontentloaded" },
    ),
    verifCodeEmail.click(),
  ]);

  const frame = inboxPage.frameLocator(inbox.iframe);
  const codeLocator = frame.locator(
    isActivation ? inbox.activationCode : inbox.verificationCode,
  );
  await codeLocator.scrollIntoViewIfNeeded();
  return (await codeLocator.textContent()).trim();
};

export const findVerCode = async (
  page,
  context,
  isActivation = false,
  newUserEmail = null,
) => {
  const inboxUrl = isActivation ? getUrlWithNewUserId(newUserEmail) : inboxUrl;
  const [inboxPage] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate((url) => window.open(url, "_blank"), inboxUrl),
  ]);
  await inboxPage.waitForLoadState();
  await inboxPage.bringToFront();

  await expect(inboxPage).toHaveTitle("Mailinator");
  await page.pause();
  const code = await getLatestVerCode(inboxPage, isActivation);

  await inboxPage.close();
  await page.bringToFront();
  return code;
};
