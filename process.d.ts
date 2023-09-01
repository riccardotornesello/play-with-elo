declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    TELEGRAM_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
    PLATFORM_BASE_URL: string;
  }
}
