import "dotenv/config";

export const env = process.env;

export const isCi = env.CI;

export const baseUrl = env.BASE_URL;
export const inboxUrl = env.INBOX_URL;
export const userId = env.USER_ID.toLowerCase();
export const userSecretKey = env.USER_SECRET_KEY;

export const userProfileURL = `${baseUrl}/${env.USER_PROFILE_PATH}`;

export const userInboxUrl = `${env.INBOX_URL}${env.USER_ID?.replace(/@.*/, "") ?? ""}`;
