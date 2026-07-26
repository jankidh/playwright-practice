import { expect } from "@playwright/test";
import { userInboxUrl } from "../../constants.js";
import { getUrlWithNewUserId } from "./newUsers.js";
import inbox from "../../pageElements/mailinator/inbox.json" assert { type: "json" };

const getLatestVerCode = async (inboxPage, isActivation = false) => {
  const verifCodeEmail = inboxPage.locator(inbox.latestVerificationEmail);
  await verifCodeEmail.waitFor({ state: "visible" });

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
  return (await codeLocator.textContent()).trim();
};

export const findVerCode = async (
  page,
  context,
  isActivation = false,
  newUserEmail = null,
) => {
  const resolvedInboxUrl = isActivation
    ? getUrlWithNewUserId(newUserEmail)
    : userInboxUrl;
  const [inboxPage] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate((url) => window.open(url, "_blank"), resolvedInboxUrl),
  ]);
  await inboxPage.waitForLoadState();
  await inboxPage.bringToFront();

  await expect(inboxPage).toHaveTitle("Mailinator");
  const code = await getLatestVerCode(inboxPage, isActivation);

  await inboxPage.close();
  await page.bringToFront();
  return code;
};
