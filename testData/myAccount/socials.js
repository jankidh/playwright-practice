import userAccount from "../../pageElements/app/page/userAccount.json" assert { type: "json" };

const notConnected = "Not connected";

export const getSocials = ({
  google = notConnected,
  facebook = notConnected,
  paypal = notConnected,
} = {}) => [
  {
    name: "Google",
    item: userAccount.googleSocial,
    status: userAccount.googleSocialStatus,
    statusText: google,
  },
  {
    name: "Facebook",
    item: userAccount.facebookSocial,
    status: userAccount.facebookSocialStatus,
    statusText: facebook,
  },
  {
    name: "PayPal",
    item: userAccount.paypalSocial,
    status: userAccount.paypalSocialStatus,
    statusText: paypal,
  },
];
