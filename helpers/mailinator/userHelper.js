import { newUserId, newInboxUrl } from "../../constants.js";
import { faker } from "@faker-js/faker";

export const getNewUserEmail = () =>
  faker.internet.email().replace(/@.*/, "@mailinator.com");

export const getUrlWithNewUserId = (newUserEmail) =>
  `${newInboxUrl}${newUserEmail.replace(/@.*/, "")}`;
