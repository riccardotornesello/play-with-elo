declare namespace NodeJS {
  export interface ProcessEnv {
    SECRET_KEY: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    TELEGRAM_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
    PLATFORM_BASE_URL: string;
    MJ_APIKEY_PUBLIC: string;
    MJ_APIKEY_PRIVATE: string;
  }
}
