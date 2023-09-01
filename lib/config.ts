import dotenv from 'dotenv';
dotenv.config();

export default {
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
  platform: {
    url: process.env.PLATFORM_BASE_URL,
  },
};
