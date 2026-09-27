import { test, expect } from "@playwright/test";
import { baseUrl, userId } from "../constants.js";
import { goToUserProfile } from "../helpers/app/navigation.js";
import { getSection } from "../testData/myAccount/sections.js";
import { getSocials } from "../testData/myAccount/socials.js";
import { getNavButtons } from "../testData/myAccount/navigation.js";
import userAccount from "../pageElements/app/page/userAccount.json" assert { type: "json" };

test("My account - page element verification", async ({ page, context }) => {
  await goToUserProfile(page, context, "account");

  await expect(page.locator(".app-container__title")).toHaveText("My account");

  await test.step("Page header", async () => {
    await expect(page.locator(userAccount.personalInfoSection)).toBeVisible();
    await expect(page.locator(userAccount.pageTitle)).toHaveText(
      "Your personal information",
    );
    await expect(page.locator(userAccount.pageDescription)).toHaveText(
      "We’ll use this to automatically fill your booking details and keep you informed.",
    );
    await expect(page.locator(userAccount.privacyPolicy)).toHaveText(
      "All information will be processed in accordance with the Ryanair Privacy Policy.",
    );

    const privacyPolicyLink = page.locator(userAccount.privacyPolicyLink);
    await expect(privacyPolicyLink).toHaveText("Ryanair Privacy Policy.");
    await expect(privacyPolicyLink).toHaveAttribute(
      "href",
      `${baseUrl}/corporate/privacy-policy`,
    );
    await expect(privacyPolicyLink).toHaveAttribute("target", "_blank");
  });

  await test.step("Personal info sections", async () => {
    const sections = getSection();
    for (const section of sections) {
      await expect(
        page.locator(section.subsection),
        section.name,
      ).toBeVisible();
      await expect(page.locator(section.label), section.name).toHaveText(
        section.labelText,
      );
      if (section.value) {
        await expect(page.locator(section.value), section.name).toHaveText(
          section.valueText,
        );
      }
      if (section.button) {
        await expect(page.locator(section.button), section.name).toBeVisible();
        await expect(page.locator(section.button), section.name).toHaveText(
          section.buttonText,
        );
      }
    }
  });

  await test.step("Socials providers", async () => {
    const socials = getSocials();
    for (const social of socials) {
      await expect(page.locator(social.item), social.name).toBeVisible();
      await expect(page.locator(social.item), social.name).toContainText(
        social.name,
      );
      await expect(page.locator(social.status), social.name).toHaveText(
        social.statusText,
      );
    }
  });

  await test.step("Sidebar navigation", async () => {
    await expect(page.locator(userAccount.menuSection)).toBeVisible();
    await expect(page.locator(userAccount.selectedNavBtn)).toHaveText(
      "Your personal information",
    );

    const navButtons = getNavButtons();

    for (const nav of navButtons) {
      const navBtn = page.locator(nav.locator);
      await expect(navBtn, nav.text).toBeVisible();
      await expect(navBtn, nav.text).toHaveText(nav.text);
      await expect(navBtn, nav.text).toHaveAttribute("href", nav.href);
    }
  });
});
