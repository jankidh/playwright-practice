import "dotenv/config";

const env = process.env;

export const baseUrl = env.BASE_URL;
export const inboxUrl = env.INBOX_URL;
export const userId = env.USER_ID;
export const userSecretKey = env.USER_SECRET_KEY;
export const userInboxUrl = `${env.INBOX_URL}${env.USER_ID.split("@")[0]}`;
