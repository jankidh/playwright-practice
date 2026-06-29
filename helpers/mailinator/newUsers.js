import { appendFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { faker } from "@faker-js/faker";
import { inboxUrl } from "../../constants.js";

const LOG_FILE = resolve(dirname(fileURLToPath(import.meta.url)), "accountList.log");

const emailLocalPart = (email) => email.replace(/@.*/, "");

export const getNewUserEmail = () =>
  `${emailLocalPart(faker.internet.email())}@mailinator.com`;

export const getUrlWithNewUserId = (newUserEmail) =>
  `${inboxUrl}${emailLocalPart(newUserEmail)}`;

export const logNewAccount = async (email) => {
  await appendFile(
    LOG_FILE,
    JSON.stringify({ email, createdAt: new Date().toISOString() }) + "\n",
  );
};
