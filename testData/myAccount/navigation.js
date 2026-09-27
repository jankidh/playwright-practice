import userAccount from "../../pageElements/app/page/userAccount.json" assert { type: "json" };

export const getNavButtons = () => [
  {
    locator: userAccount.personalInfoNavBtn,
    text: "Your personal information",
    href: "personal-info",
  },
  {
    locator: userAccount.travelDocumentsNavBtn,
    text: "Travel documents",
    href: "travel-documents",
  },
  {
    locator: userAccount.travelCompanionsNavBtn,
    text: "Travel companions",
    href: "travel-companions",
  },
  {
    locator: userAccount.erasmusNavBtn,
    text: "Erasmus",
    href: "erasmus",
  },
];
