export default {
  security: {
    secretKey: process.env.SECRET_KEY,
  },
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
  platform: {
    url: process.env.PLATFORM_BASE_URL,
  },
  mailjet: {
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
  },
};
