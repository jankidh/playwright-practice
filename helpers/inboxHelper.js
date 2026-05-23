import { expect } from "@playwright/test";
import { inboxUrl } from "../constants.js";

const getLatestVerCode = async (inboxPage) => {
  const verifCodeEmail = inboxPage.locator(
    "//tr[1]/td[3][contains(.,'Verification code')]",
  );
  await verifCodeEmail.isVisible();

  await Promise.all([
    inboxPage.waitForURL(
      (url) => url.searchParams.has("msgid") && !url.searchParams.has("to"),
      { waitUntil: "domcontentloaded" },
    ),
    verifCodeEmail.click(),
  ]);

  const frame = inboxPage.frameLocator("#html_msg_body");
  const codeLocator = frame.locator("//table[3]/tbody/tr/td[contains(.,' ')]");
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
