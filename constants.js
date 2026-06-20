import "dotenv/config";

const env = process.env;

export const baseUrl = env.BASE_URL;
export const userId = env.USER_ID;
export const userSecretKey = env.USER_SECRET_KEY;
export const inboxUrl = env.INBOX_URL;
export const newUserId = env.NEW_USER_ID;
export const newUserSecretKey = env.NEW_USER_SECRET_KEY;
export const newInboxUrl = env.NEW_INBOX_URL;
